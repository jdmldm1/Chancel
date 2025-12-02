# Implementation Guide: Email, File Upload & Analytics

This guide covers implementing the three requested features:
1. Email Notifications
2. File Upload for Resources
3. Session Analytics

---

## ✅ 1. Email Notifications (Partially Complete)

### What's Done:
- ✅ Resend package installed (`npm install resend`)
- ✅ Email service created (`/apps/api/src/services/email.ts`)
- ✅ Email templates created for:
  - Session invitations
  - Comment replies
  - Prayer request updates
  - Group invitations
- ✅ Environment variables added to `.env.example`

### What's Needed:

#### A. Get Resend API Key
1. Sign up at https://resend.com (free tier: 100 emails/day)
2. Verify your domain OR use test mode
3. Get your API key
4. Add to `.env` file:
   ```
   RESEND_API_KEY=re_your_actual_key_here
   EMAIL_FROM="Chancel <noreply@yourdomain.com>"
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

#### B. Add Email Triggers to Resolvers

**Location:** `/apps/api/src/graphql/resolvers/index.ts`

Add these imports at the top:
```typescript
import { emailService } from '../../services/email'
```

**For Session Invitations** (after line 840 in joinSession mutation):
```typescript
// Send email notification
const user = await context.prisma.user.findUnique({
  where: { id: context.userId },
})
const leader = await context.prisma.user.findUnique({
  where: { id: session.leaderId },
})

if (user?.emailNotifications) {
  await emailService.sendSessionInvitation({
    to: user.email,
    userName: user.name || 'there',
    sessionTitle: session.title,
    sessionDate: session.startDate,
    sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sessions/${session.id}`,
    invitedBy: leader?.name || 'A leader',
  })
}
```

**For Comment Replies** (in createComment mutation, around line 500):
```typescript
// If this is a reply, notify parent comment author
if (args.input.parentId) {
  const parentComment = await context.prisma.comment.findUnique({
    where: { id: args.input.parentId },
    include: { user: true, passage: { include: { session: true } } },
  })

  if (parentComment && parentComment.user.commentNotifications) {
    const commenter = await context.prisma.user.findUnique({
      where: { id: context.userId },
    })

    await emailService.sendCommentReply({
      to: parentComment.user.email,
      userName: parentComment.user.name || 'there',
      sessionTitle: parentComment.passage.session.title,
      commentAuthor: commenter?.name || 'Someone',
      commentContent: args.input.content.substring(0, 200),
      sessionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sessions/${parentComment.passage.sessionId}`,
    })
  }
}
```

**For Prayer Requests** (in togglePrayerReaction mutation):
```typescript
// Notify prayer request author
const prayerRequest = await context.prisma.prayerRequest.findUnique({
  where: { id: args.prayerRequestId },
  include: { user: true },
})

if (prayerRequest && prayerRequest.user.prayerNotifications && prayerRequest.userId !== context.userId) {
  const reactor = await context.prisma.user.findUnique({
    where: { id: context.userId },
  })

  await emailService.sendPrayerUpdate({
    to: prayerRequest.user.email,
    userName: prayerRequest.user.name || 'there',
    prayerRequestContent: prayerRequest.content.substring(0, 200),
    updateType: 'reaction',
    reactorName: reactor?.name || 'Someone',
  })
}
```

---

## 2. File Upload for Resources

### What's Needed:

#### A. Install Dependencies
```bash
cd apps/api
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer
```

#### B. Set Up MinIO (Local Development)

1. Add to `docker-compose.yml`:
```yaml
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  minio_data:
```

2. Start MinIO:
```bash
docker-compose up -d minio
```

3. Access console at http://localhost:9001
4. Create bucket named "chancel-resources"

#### C. Create Upload Service

**File:** `/apps/api/src/services/storage.ts`
```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
  },
  forcePathStyle: true,
})

export class StorageService {
  private bucket = process.env.S3_BUCKET || 'chancel-resources'

  async uploadFile(file: Buffer, fileName: string, contentType: string): Promise<string> {
    const key = `${Date.now()}-${fileName}`

    await s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
    }))

    return `${process.env.S3_PUBLIC_URL}/${this.bucket}/${key}`
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = fileUrl.split('/').pop()
    if (!key) return

    await s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }))
  }
}

export const storageService = new StorageService()
```

#### D. Create Upload Endpoint

**File:** `/apps/api/src/routes/upload.ts`
```typescript
import { Router } from 'express'
import multer from 'multer'
import { storageService } from '../services/storage'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const fileUrl = await storageService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    )

    res.json({ url: fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
```

Register in `apps/api/src/index.ts`:
```typescript
import uploadRouter from './routes/upload'
app.use('/api', uploadRouter)
```

#### E. Frontend Upload Component

**File:** `/apps/web/components/session/FileUpload.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Upload, X } from 'lucide-react'

export default function FileUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      onUploadComplete(data.url)
    } catch (error) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragActive(false)
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
      }}
    >
      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
      <p>Drag & drop file or <label className="text-blue-600 cursor-pointer">
        browse
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </label></p>
      {uploading && <p className="mt-2">Uploading...</p>}
    </div>
  )
}
```

---

## 3. Session Analytics

### What's Needed:

#### A. Create Analytics Queries

Add to GraphQL schema (`typeDefs.ts`):
```graphql
type SessionAnalytics {
  sessionId: ID!
  totalParticipants: Int!
  totalComments: Int!
  averageCommentsPerUser: Float!
  mostActiveUsers: [UserActivity!]!
  attendanceRate: Float!
}

type UserActivity {
  user: User!
  commentCount: Int!
}

extend type Query {
  sessionAnalytics(sessionId: ID!): SessionAnalytics!
  leaderAnalytics: LeaderAnalytics!
}

type LeaderAnalytics {
  totalSessions: Int!
  totalParticipants: Int!
  averageAttendance: Float!
  topSessions: [Session!]!
}
```

#### B. Create Analytics Resolvers

```typescript
sessionAnalytics: async (_parent: unknown, args: { sessionId: string }, context: Context) => {
  const session = await context.prisma.session.findUnique({
    where: { id: args.sessionId },
    include: {
      participants: { include: { user: true } },
      comments: { include: { user: true } },
    },
  })

  if (!session) throw new Error('Session not found')

  // Calculate stats
  const userCommentCounts = session.comments.reduce((acc, comment) => {
    acc[comment.userId] = (acc[comment.userId] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostActiveUsers = Object.entries(userCommentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([userId, count]) => ({
      user: session.participants.find(p => p.userId === userId)?.user,
      commentCount: count,
    }))

  return {
    sessionId: session.id,
    totalParticipants: session.participants.length,
    totalComments: session.comments.length,
    averageCommentsPerUser: session.participants.length > 0
      ? session.comments.length / session.participants.length
      : 0,
    mostActiveUsers,
    attendanceRate: 100, // TODO: Implement actual attendance tracking
  }
}
```

#### C. Analytics Dashboard Page

**File:** `/apps/web/app/analytics/page.tsx`

Create a dashboard showing:
- Sessions over time (chart)
- Average attendance
- Top sessions by engagement
- Most active members
- Comments over time

Use a charting library like Recharts:
```bash
cd apps/web
npm install recharts
```

---

## Environment Variables Summary

Add to all `.env` files:

```bash
# Email (Resend)
RESEND_API_KEY=re_your_key
EMAIL_FROM="Chancel <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Storage (S3/MinIO)
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=chancel-resources
S3_PUBLIC_URL=http://localhost:9000

# API
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Testing Checklist

### Email Notifications:
- [ ] Join a session → Receive invitation email
- [ ] Reply to comment → Original author receives notification
- [ ] React to prayer → Author receives notification
- [ ] Check spam folder if not receiving

### File Upload:
- [ ] Drag & drop file → Upload succeeds
- [ ] Click browse → Upload succeeds
- [ ] View uploaded file → File displays correctly
- [ ] Delete resource → File removed from storage

### Analytics:
- [ ] View session analytics → See correct participant count
- [ ] View session analytics → See correct comment count
- [ ] View leader analytics → See all sessions
- [ ] Charts render correctly

---

## Priority Order:

1. **Email Notifications** - Easiest, just add triggers (30 min)
2. **Analytics** - GraphQL queries only (1 hour)
3. **File Upload** - Most complex, needs infrastructure (2-3 hours)

Would you like me to implement any specific part of this in detail?
