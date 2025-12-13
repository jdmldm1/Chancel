# Chancel

**Sacred space. Shared study.**

An online group Bible study platform for collaborative group sessions with real-time commenting and discussion.

---

**🌐 Live Site:** [chancel.study](http://chancel.study/) - Try it now!

**📦 GitHub:** [github.com/jdmldm1/Chancel](https://github.com/jdmldm1/Chancel)

---

## 🌟 Visual Overview

Welcome to Chancel, a modern platform designed for immersive group Bible study. Below is a visual tour of the key features that make Chancel a powerful tool for your study group.

| Dashboard & Sessions                                   | AI-Powered Insights                                        |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| ![Dashboard](screenshots/chancel_dashboard.png)        | ![AI Insights](screenshots/chancel_ai_insights_summary.png) |
| *Your personalized starting point. Effortlessly manage upcoming and past sessions, view group activity, and stay organized.* | *Deepen your understanding with AI-driven summaries, character analyses, and historical context for any scripture passage, powered by Ollama.* |

| Bible Browser & Passage Comments                       | Session Details & Chat                                     |
| ------------------------------------------------------ | ---------------------------------------------------------- |
| ![Bible Browser](screenshots/chancel_bible_browser.png) | ![Session Details](screenshots/chancel_session_details.png) |
| *Navigate the Bible with ease. Search for passages, add them to your sessions, and see where group discussions are unfolding.* | *Dive into the heart of your study with a dedicated session view, complete with real-time chat for dynamic group interaction and shared insights.* |

| Passage Commenting                                     |
| ------------------------------------------------------ |
| ![Passage Commenting](screenshots/chancel_passagecomment.png) |
| *Engage directly with the text. Click on any verse to add your thoughts, ask questions, and participate in threaded discussions, all in real-time.* |

### Core Features

-   **Interactive Study Sessions:** Create and manage dynamic study sessions, effortlessly adding scripture passages, videos, and resources to guide your group's exploration of the Bible. Leaders can prepare sessions, and members can join to engage with the material.
-   **Real-Time Discussion:** Foster vibrant community by allowing participants to comment directly on specific verses. All comments and replies update instantly across the group, enabling rich, contextualized conversations that deepen understanding.
-   **AI-Powered Insights:** Leverage optional integration with **Ollama** to unlock deeper understanding. Generate instant summaries, insightful character analyses, and comprehensive historical context for any scripture passage, enriching your study experience.
-   **Virtual Meeting Rooms:** Integrate seamlessly with your discussion by utilizing built-in **Jitsi** video call rooms. Facilitate face-to-face interaction and discussion alongside the scripture text and comments, bringing your group closer.
-   **Resource Sharing:** Easily upload and share supplementary materials such as PDFs, external links, and personal notes directly within a session, ensuring all members have access to valuable study aids.
-   **Prayer Wall:** Cultivate spiritual support with a dedicated Prayer Wall where group members can openly share prayer requests and intercede for one another, fostering a sense of community and care.
-   **Series Planning:** Structure your studies effectively by organizing individual sessions into cohesive series. This allows for in-depth exploration of books, themes, or topics over multiple meetings, providing continuity and progressive learning.

---

## Overview

Chancel enables Bible study leaders to organize study sessions with scripture passages, videos, and resources, while allowing group members to engage through inline comments and discussions on specific verses. Built with GraphQL, Next.js, and PostgreSQL for a modern, type-safe development experience.

## Features

- **User Authentication** - Role-based access (Leader/Member) with NextAuth.js
- **Session Management** - Leaders create and schedule study sessions
- **Scripture Display** - Verse-level commenting and annotations
- **AI Insights** - Optional Ollama integration for scripture analysis
- **Real-time Discussions** - GraphQL subscriptions for live updates
- **Email Notifications** - Automatic notifications for sessions, comments, and prayers
- **File Sharing** - Share study materials and resources
- **Threaded Comments** - Nested discussions on scripture passages

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **GraphQL Client:** Apollo Client (caching, real-time subscriptions)
- **State Management:** Apollo Client cache + Zustand
- **Forms:** React Hook Form + Zod validation

### Backend
- **API Layer:** GraphQL with Apollo Server
- **Database:** PostgreSQL with Prisma ORM
- **Runtime:** Node.js
- **Real-time:** GraphQL Subscriptions + Socket.IO
- **Authentication:** NextAuth.js with JWT sessions

### Testing & Quality
- **Unit/Integration:** Vitest with coverage
- **E2E Testing:** Playwright (cross-browser)
- **Code Quality:** SonarQube + ESLint + Prettier
- **Security:** Snyk + eslint-plugin-security + npm audit

### Infrastructure
- **Containerization:** Docker
- **Orchestration:** Kubernetes (K3s)
- **Monorepo:** Turborepo with npm workspaces

## Quick Start

### Prerequisites

- **Node.js 18+** - Check with `node --version`
- **PostgreSQL 14+** - Database server
- **npm** - Package manager (comes with Node)

### 1. Clone & Install

```bash
git clone <repository-url>
cd BibleProject
npm install
```

### 2. Database Setup

**Option A: Docker (Recommended)**
```bash
docker run -d \
  --name bibleproject-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=bibleproject \
  -p 5432:5432 \
  postgres:15-alpine
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
createdb bibleproject
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/bibleproject?schema=public"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-change-in-production"

# Optional: AI Insights (requires Ollama)
OLLAMA_HOST="localhost"
OLLAMA_PORT="11434"

# Optional: Email Notifications (requires Resend API key)
RESEND_API_KEY="re_your_key_here"
EMAIL_FROM="Chancel <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
npm -w @bibleproject/db run db:push              # Create database tables
npm -w @bibleproject/db run db:seed 2024         # Add 52-week canonical Bible plan
npm -w @bibleproject/db run db:seed 2025         # Add 52-week canonical Bible plan
npm -w @bibleproject/db run db:seed:studies 2024 # Add topical, book, character & thematic studies
npm -w @bibleproject/db run db:seed:studies 2025 # Add topical, book, character & thematic studies
```

**Canonical Bible Study (52 weeks):** Complete year-long journey through the entire Bible in 4 quarterly series.

**Additional Studies (73 sessions):** Variety of focused studies including:
- **Topical Studies** (4 series): Prayer, Marriage & Family, Faith & Doubt, The Holy Spirit
- **Book Studies** (4 series): Philippians, James, Jonah, Ruth
- **Character Studies** (3 series): David, Paul, Moses
- **Thematic Studies** (2 series): The Covenant, The Kingdom of God

Both seed scripts are non-destructive and can be run multiple times with different years.

**Sample Test Credentials:**
- Leader: `leader@example.com` / `password`
- Member 1: `member1@example.com` / `password`
- Member 2: `member2@example.com` / `password`

### 5. Start Development Servers

```bash
npm run dev
```

**Access Points:**
- Frontend: http://localhost:3000
- GraphQL API: http://localhost:4000/graphql (Apollo Studio)

## Available Commands

### Development
```bash
npm run dev              # Start all services (Next.js + GraphQL API)
npm run build            # Build for production
npm run start            # Start production server
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run codegen          # Generate GraphQL types from schema
```

### Database
```bash
npm -w @bibleproject/db run db:push              # Sync Prisma schema to database
npm -w @bibleproject/db run db:migrate           # Create and run migrations
npm -w @bibleproject/db run db:seed <year>       # Seed 52-week canonical Bible plan
npm -w @bibleproject/db run db:seed:studies <year> # Seed topical, book, character & thematic studies
npm -w @bibleproject/db run db:seed:bible        # Import full Bible text (31,102 verses)
npm -w @bibleproject/db run db:studio            # Open Prisma Studio (database GUI)
```

**Canonical Bible Study Plan (52 weeks):**
- Covers entire Bible from Genesis to Revelation in 4 quarterly series
- Automatically calculates first Sunday of specified year as start date
- Generates 52 weekly sessions with detailed reading notes
- Example: `npm -w @bibleproject/db run db:seed 2026`

**Additional Study Plans (73 sessions):**
- **4 Topical Series**: Prayer, Marriage & Family, Faith & Doubt, Holy Spirit
- **4 Book Studies**: Philippians, James, Jonah, Ruth
- **3 Character Studies**: David, Paul, Moses
- **2 Thematic Studies**: The Covenant, The Kingdom of God
- Example: `npm -w @bibleproject/db run db:seed:studies 2026`

Both seed scripts are non-destructive and can be run multiple times with different years.

### Testing
```bash
npm run test             # Run unit/integration tests (Vitest)
npm run test:watch       # Watch mode for tests
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests (Playwright)
npm run test:e2e:ui      # E2E tests with Playwright UI
npm run test:e2e:debug   # Debug E2E tests
```

### Code Quality & Security
```bash
npm run lint             # Run ESLint + Prettier checks
npm run lint:fix         # Auto-fix linting issues
npm audit                # Check dependency vulnerabilities
npm run security:check   # Run Snyk security scan
npm run sonar:scan       # Run SonarQube analysis (requires server)
```

### Docker & Kubernetes
```bash
# Local development
docker compose up -d     # Start all services
docker compose down      # Stop services

# Kubernetes deployment
cd infra/kubernetes
kubectl apply -f .       # Deploy to cluster
```

## Email Notifications Setup

Chancel includes a built-in email notification system that alerts users about important events:
- Session invitations when joining a study
- Replies to their comments
- Prayer request reactions

### Features

**Automatic Notifications:**
- Users receive emails when someone joins their session
- Comment authors get notified of replies
- Prayer request authors are notified when someone prays for them

**User Preferences:**
- Users can toggle email notifications in their profile settings
- Separate controls for email, comment, and prayer notifications
- Notifications respect user preferences automatically

**Development Mode:**
- Without an API key, emails are logged to the console
- All functionality works normally for testing
- No email service required for local development

### Setup Instructions

**1. Sign Up for Resend (Free Tier)**

Visit [resend.com](https://resend.com) and create a free account:
- Free tier: 100 emails/day, 3,000/month
- No credit card required
- Simple API integration

**2. Get Your API Key**

After signing up:
1. Go to API Keys in your Resend dashboard
2. Click "Create API Key"
3. Copy your API key (starts with `re_`)

**3. Configure Environment Variables**

Add these variables to your `.env` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="Chancel <noreply@yourdomain.com>"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important:**
- Replace `re_your_actual_api_key_here` with your real API key
- Update `EMAIL_FROM` with your verified domain or use the test domain
- Set `NEXT_PUBLIC_APP_URL` to your frontend URL

**4. Domain Verification (Production)**

For production use:
1. Add your domain in Resend dashboard
2. Add DNS records (SPF, DKIM) provided by Resend
3. Wait for verification (usually 5-10 minutes)
4. Update `EMAIL_FROM` to use your verified domain

For development/testing, you can skip domain verification and use Resend's test mode.

**5. Restart the API Server**

```bash
# Stop the server (Ctrl+C)
# Restart with new environment variables
npm run dev
```

**6. Test Email Notifications**

Verify emails are working:
1. Join a session → Check email inbox
2. Reply to a comment → Original author receives email
3. React to a prayer request → Author receives notification

Check server logs for email confirmation:
```bash
✅ Email sent: { id: 're_xxxxx' }
```

### Email Templates

Chancel includes professionally designed HTML email templates:

- **Session Invitations** - Purple gradient, session details
- **Comment Replies** - Blue gradient, comment preview
- **Prayer Updates** - Red gradient, prayer content
- **Group Invitations** - Green gradient, group info

All templates are mobile-responsive and include direct links back to the app.

### Troubleshooting

**Emails not sending:**
- Check `RESEND_API_KEY` is set correctly in `.env`
- Verify API server restarted after adding variables
- Check server console for error messages
- Ensure user has email notifications enabled in profile

**Emails going to spam:**
- Verify your domain in Resend (production)
- Add SPF and DKIM DNS records
- Use a professional `EMAIL_FROM` address
- Avoid spam trigger words in content

**API key not working:**
- Ensure no quotes or spaces in `.env` value
- Regenerate API key in Resend dashboard
- Check API key starts with `re_`

### Cost & Limits

**Free Tier:**
- 100 emails per day
- 3,000 emails per month
- Perfect for small to medium groups

**Paid Plans:**
- Start at $20/month for 50,000 emails
- Volume discounts available
- 99.9% uptime SLA

For most Bible study groups, the free tier is more than sufficient.

---

## Project Structure

```
BibleProject/
├── apps/
│   ├── web/                 # Next.js frontend + Apollo Client
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & Apollo config
│   │   └── __tests__/       # E2E tests (Playwright)
│   └── api/                 # GraphQL API server
│       ├── src/
│       │   ├── graphql/     # Schema, resolvers, type definitions
│       │   ├── services/    # Business logic layer
│       │   ├── middleware/  # Auth, logging, error handling
│       │   └── __tests__/   # API unit/integration tests
│       └── vitest.config.ts
├── packages/
│   ├── db/                  # Prisma schema & seed data
│   ├── graphql-types/       # Generated GraphQL types
│   ├── types/               # Shared TypeScript types
│   └── auth/                # Authentication logic
├── tests/
│   └── e2e/                 # Cross-app E2E tests
├── infra/                   # Infrastructure as Code
│   ├── kubernetes/          # K8s manifests
│   └── docker compose.yml   # Local development
├── .eslintrc.json           # ESLint + security rules
├── playwright.config.ts     # E2E test configuration
├── sonar-project.properties # SonarQube configuration
├── DEVELOPER_GUIDE.md       # Developer guide & architecture
└── TODO.md                  # Project task tracker
```

## GraphQL API

Once running, visit **http://localhost:4000/graphql** for Apollo Studio.

**Example Query:**
```graphql
query GetSessions {
  sessions {
    id
    title
    description
    scheduledDate
    leader {
      name
      email
    }
    scripturePassages {
      book
      chapter
      verseStart
      verseEnd
      content
    }
    comments {
      content
      user {
        name
      }
    }
  }
}
```

**Example Mutation:**
```graphql
mutation CreateSession {
  createSession(input: {
    title: "Study of Romans"
    description: "Deep dive into Paul's letter"
    scheduledDate: "2025-12-01T19:00:00Z"
  }) {
    id
    title
  }
}
```

## Development Workflow

### Architecture & Guidelines

See **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** for:
- Detailed architecture decisions
- Development best practices
- GraphQL implementation patterns
- Testing strategy
- Security considerations
- Code quality standards

### Task Management

See **[TODO.md](./TODO.md)** for:
- Project roadmap
- Current phase progress
- Upcoming features
- Task priorities

## Troubleshooting

### Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -U postgres -h localhost -d bibleproject -c "SELECT 1"

# Verify DATABASE_URL in .env files
cat .env | grep DATABASE_URL
```

### Port Already in Use
```bash
# Run on different ports
PORT=3002 npm run dev  # Frontend
# Edit apps/api/.env and change PORT=4001
```

### GraphQL Type Errors
```bash
# Regenerate types from schema
npm run codegen
```

### Prisma Client Not Found
```bash
# Regenerate Prisma Client
cd packages/db
npm run generate
```

### Node Version Issues
```bash
# Apollo Server v5 requires Node 20+
# Currently using v4 for Node 18 compatibility
node --version  # Should be 18.x or higher
```

## Security Best Practices

- **Environment Variables:** Never commit `.env` files - use `.env.example` as template
- **Authentication:** JWT tokens stored in HTTP-only cookies
- **Authorization:** Field-level and resolver-level checks in GraphQL
- **Database:** Row-level security (RLS) in PostgreSQL
- **Dependencies:** Run `npm audit` regularly and fix vulnerabilities
- **Code Scanning:** Use `npm run security:check` before commits
- **SonarQube:** Regular code quality scans for security hotspots

## Contributing

1. Follow the development guidelines in [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)
2. Use TypeScript strict mode for all code
3. Write tests for new features (Vitest for units, Playwright for E2E)
4. Run linting and security checks before committing
5. Keep commits atomic and use conventional commit messages
6. Auto-generate GraphQL types - never write them manually
7. Update TODO.md when completing tasks

## Deployment

### Docker Build
```bash
docker build -f docker/Dockerfile.web -t bibleproject-web .
docker build -f docker/Dockerfile.api -t bibleproject-api .
```

### Kubernetes Deployment
```bash
cd infra/kubernetes
kubectl apply -f namespace.yaml
kubectl apply -f postgres/
kubectl apply -f api/
kubectl apply -f web/
kubectl apply -f traefik/
```

### Environment Variables (Production)
- Use Kubernetes Secrets for sensitive data
- Use ConfigMaps for non-sensitive configuration
- Set `NODE_ENV=production`
- Generate strong secrets for `NEXTAUTH_SECRET` and `JWT_SECRET`

## Performance Considerations

- **GraphQL:** DataLoader for N+1 query prevention
- **Caching:** Apollo Client cache + Redis (future)
- **Database:** Proper indexing on foreign keys and query fields
- **Real-time:** WebSocket connections for GraphQL subscriptions
- **CDN:** Serve static assets from CDN in production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues:** Report bugs and request features via GitHub Issues
- **Documentation:** See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for comprehensive docs
- **Tasks:** Track progress in [TODO.md](./TODO.md)
- **Financial:** If you find this project helpful, you can [buy me a coffee](https://buymeacoffee.com/jdmldm1) to support its development.

## Contact

For questions, support, or assistance with setting up Chancel for your church or ministry, please contact us at chancel@duck.com. We are happy to help you get started.

---

**Built with ❤️ for Bible study communities**
