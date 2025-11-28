# BibleProject Task List

Last Updated: 2025-11-28

## Recent Bug Fixes (Completed Today)

- [x] Fixed comment display issue - Added `verseNumber` field to GraphQL query
  - **File:** `apps/web/app/sessions/[id]/page.tsx`
  - Comments now appear after posting
- [x] Added auto-redirect to /sessions after successful login
  - **File:** `apps/web/lib/auth.ts`
  - Added redirect callback to NextAuth config
- [x] Fixed CORS issue with GraphQL API in Coder environment
  - **Files:** `apps/web/next.config.js`, `apps/web/.env.local`
  - Added GraphQL proxy through Next.js
- [x] Fixed bcrypt password hash in seed data
  - **File:** `packages/db/prisma/seed.ts`
  - Generated valid hash for test users

## Phase 1: Foundation (Infrastructure & Auth) ✅

- [x] Set up monorepo structure with Next.js, Prisma, and shared packages
- [x] Configure PostgreSQL database and Prisma schema with core tables
  - Complete schema including Users, Sessions, ScripturePassages, Comments, SessionResources, SessionParticipants, Notifications
- [x] Implement NextAuth.js authentication with user roles (Leader/Member)
  - JWT-based auth with bcrypt password hashing
  - Role support (LEADER/MEMBER) in user model
- [x] Create user management pages (signup, login, profile, role assignment)
  - Login page at `/auth/login`
  - Signup page at `/auth/signup`
  - Navigation component with auth state

## Phase 2: Core Features (Sessions & Comments) ✅

- [x] Build session management features (create, list, schedule study sessions)
  - GraphQL API with full CRUD operations
  - SessionList and SessionForm components
  - Session detail page at `/sessions/[id]`
  - "My Sessions" view showing user's sessions
- [x] Implement scripture display component with verse selection and organization
  - ScripturePassageCard component
  - VerseByVersePassage component for inline verse display
  - Support for verse ranges and ordering
- [x] Build inline commenting system on scripture passages (verse-level comments)
  - CommentSection component with inline forms
  - CommentItem component for display
  - Verse-specific comments via `verseNumber` field
- [x] Implement comment threading and nested replies functionality
  - Parent-child relationship via `parentId`
  - Recursive comment display with replies
- [x] Set up GraphQL Subscriptions for real-time comment updates
  - WebSocket server configured with graphql-ws
  - Custom PubSub implementation
  - `commentAdded` subscription for session-specific updates
  - Published on comment creation (line 285-286 in resolvers)

## Phase 3: User Experiences (Dashboards & Sharing) 🔄

- [x] Build file upload and sharing system for session resources
  - SessionResource model with file metadata
  - SessionResources component for display
  - Upload API route at `/api/upload`
  - GraphQL mutations for create/delete resources
- [x] Add video embedding support (schema ready)
  - ResourceType enum added (FILE, VIDEO_UPLOAD, VIDEO_YOUTUBE, VIDEO_VIMEO)
  - `videoId` field added to SessionResource
  - **Pending:** UI implementation (see "New Features - Video Support" below)
- [ ] Create leader dashboard with session planning and content management
  - **Note:** Sessions page exists but needs dedicated leader view with analytics
- [ ] Build member dashboard showing joined sessions and discussions
  - **Note:** `mySessions` query exists but no dedicated member dashboard UI
- [x] Implement session participant management (invites, join, access control)
  - SessionParticipant model with join/leave mutations
  - Authorization checks for session access
  - **Missing:** Invite system (only join/leave implemented)

## Phase 4: Enhancement & Deployment 🔄

- [ ] Add email notification system foundation (queue, templates, sending)
  - **Note:** Notification model exists in schema but no email sending logic
- [ ] Create Docker Compose setup for local development (PostgreSQL, MinIO, app)
  - **Status:** No docker-compose.yml file found
  - **Status:** No docker/ directory or Dockerfiles
- [ ] Build Kubernetes manifests for production deployment (Traefik, PostgreSQL, app)
  - **Status:** No infra/ directory found
- [ ] Set up CI/CD pipeline (linting, type checking, testing, Docker builds)
  - **Partial:** Scripts exist in package.json but no CI/CD config files

## Phase 5: Polish & Testing 🔄

- [x] Write test infrastructure and initial tests
  - Vitest configured for API tests
  - Playwright configured for E2E tests
  - Test files: `session.resolvers.test.ts`, `session-management.spec.ts`, `example.spec.ts`
- [ ] Write comprehensive test suite (unit, integration, e2e tests)
  - **Status:** Basic tests exist but coverage is minimal
  - **Missing:** Frontend component tests, resolver integration tests, full E2E flows
- [ ] Add user interface polish and accessibility improvements
  - **Status:** Basic UI with Tailwind CSS, needs accessibility audit
- [ ] Implement search and filtering across sessions and comments
  - **Missing:** No search functionality implemented
- [ ] Add session analytics and engagement tracking dashboard
  - **Missing:** No analytics implemented
- [ ] Create documentation (API docs, deployment guide, user guide)
  - **Exists:** CLAUDE.md with comprehensive project overview
  - **Missing:** API documentation, deployment guide, user guide

---

## Current Status Summary

### ✅ Completed
- Full authentication system with NextAuth.js
- Complete GraphQL API with Apollo Server
- Database schema with all core models
- Session management (CRUD operations)
- Scripture passage display with verse-level granularity
- Comment system with threading and replies
- Real-time updates via GraphQL Subscriptions
- File sharing functionality
- Basic E2E and unit test setup

### 🔄 In Progress / Partially Complete
- Dashboard views (data exists, UI needs improvement)
- Testing (infrastructure exists, needs more coverage)
- Participant management (join/leave works, invites missing)

### ❌ Not Started
- Email notification sending (model exists, no implementation)
- Docker/containerization setup
- Kubernetes infrastructure
- CI/CD pipeline configuration
- Search and filtering features
- Analytics dashboard
- Comprehensive documentation

## New Features - Bible Pre-loading System 📖

### Schema (Completed)
- [x] Add ScriptureLibrary table to schema
  - Fields: book, chapter, verseStart, verseEnd, content
  - Unique constraint on book/chapter/verse combination
  - Indexed by book and chapter
- [x] Create import script at `packages/db/prisma/seed-bible.ts`
  - Parses markdown Bible files
  - Supports formats: `# Genesis 1` or `# John 3:16-17`

### Database Migration (Required)
- [ ] Run database migration
  ```bash
  cd packages/db
  npx prisma db push
  npx prisma generate
  ```

### Import Bible Data (Pending User's Markdown File)
- [ ] Add Bible markdown file to project
- [ ] Run import script: `npx tsx prisma/seed-bible.ts /path/to/bible.md`
- [ ] Verify data imported correctly

### UI Implementation (Not Started)
- [ ] Add GraphQL query to search ScriptureLibrary
- [ ] Create "Browse Bible" page (`/bible`)
  - Search by book, chapter, verse
  - Preview passages
  - Filter by Old Testament / New Testament
- [ ] Add "Add to Session" button to insert passages into sessions
- [ ] Show recently used passages in session creation form
- [ ] Add verse-by-verse parsing on import for better search

**Expected Markdown Format:**
```markdown
# Genesis 1
1 In the beginning God created the heavens and the earth.
2 Now the earth was formless and empty...

# John 3:16-17
For God so loved the world that he gave his one and only Son...
```

---

## New Features - Video Embedding Support 🎥

### Schema (Completed)
- [x] Add ResourceType enum (FILE, VIDEO_UPLOAD, VIDEO_YOUTUBE, VIDEO_VIMEO)
- [x] Add resourceType and videoId fields to SessionResource

### Database Migration (Required)
- [ ] Run database migration (same as Bible pre-loading above)

### GraphQL API (Not Started)
- [ ] Update GraphQL schema in `apps/api/src/graphql/schema/typeDefs.ts`
  - Add ResourceType enum
  - Add resourceType and videoId to SessionResource type
  - Update CreateSessionResourceInput
- [ ] Update resolvers to handle video resources

### UI Implementation (Not Started)
- [ ] Create VideoPlayer component (`apps/web/components/session/VideoPlayer.tsx`)
  - YouTube embed support
  - Vimeo embed support
  - HTML5 video player for uploads
- [ ] Create video URL parser utility
  - Extract YouTube video IDs from URLs
  - Extract Vimeo video IDs from URLs
- [ ] Update SessionResources component
  - Add video URL/ID input fields
  - Auto-detect video type from URL
  - Display VideoPlayer for video resources
  - Keep download link for FILE types
- [ ] Add video upload support to upload API

### Future Enhancements (Optional)
- [ ] Timestamp-based comments on videos
- [ ] Video playlist support
- [ ] Video transcoding for web playback
- [ ] Thumbnail generation
- [ ] Download option for offline viewing
- [ ] Video progress tracking per user

**Code examples and implementation details in IMPLEMENTATION_SUMMARY.md**

---

## Next Recommended Steps

1. **Complete New Features (High Priority)**
   - Run database migrations for Bible library and video support
   - Test Bible import with markdown file
   - Implement VideoPlayer component
   - Create Browse Bible UI

2. **Complete User Dashboards**
   - Build dedicated leader dashboard with session overview
   - Build member dashboard with activity feed
   - Add session analytics to leader view

3. **Email Notifications**
   - Integrate email service (Resend/SendGrid)
   - Create notification templates
   - Implement notification queue processing

4. **Comment Enhancements**
   - Edit/delete own comments
   - @mentions for notifying participants
   - Mark comments as "resolved"
   - Sort comments by date/relevance

5. **DevOps & Infrastructure**
   - Create Dockerfiles for web and api apps
   - Set up docker-compose.yml for local development
   - Create Kubernetes manifests
   - Set up CI/CD with GitHub Actions

6. **Testing & Quality**
   - Increase test coverage to 80%+
   - Add component tests for React components
   - Create full user flow E2E tests
   - Set up SonarQube integration

7. **Polish & Features**
   - Implement search across sessions and comments
   - Add accessibility improvements
   - Create user documentation
   - Build analytics dashboard

---

## Files Recently Modified

1. `packages/db/prisma/schema.prisma` - Added ScriptureLibrary table and ResourceType enum
2. `packages/db/prisma/seed-bible.ts` - New Bible import script (created)
3. `packages/db/prisma/seed.ts` - Fixed bcrypt password hashes
4. `apps/web/lib/auth.ts` - Added auto-redirect callback
5. `apps/web/app/sessions/[id]/page.tsx` - Fixed comment query (added verseNumber)
6. `apps/web/next.config.js` - Added GraphQL proxy for CORS fix
7. `apps/web/.env.local` - Updated GraphQL URL to use proxy
8. `apps/web/package.json` - Added @prisma/client and @bibleproject/db dependencies

## Notes

- Project is ~65% complete based on original roadmap (up from 60%)
- Core functionality is solid and working - comments, sessions, auth all functional
- New features added: Bible pre-loading system (schema ready), Video embedding (schema ready)
- Main gaps are in deployment infrastructure and polish features
- Real-time features using GraphQL Subscriptions instead of Socket.IO (architectural decision)
- No profile management page yet (only login/signup)
- Database migrations pending for new features (Bible library + video support)
