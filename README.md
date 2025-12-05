# Chancel

**Sacred space. Shared study.**

An online Bible study platform for collaborative group sessions with real-time commenting and discussion.

## Overview

Chancel enables Bible study leaders to organize study sessions with scripture passages, videos, and resources, while allowing group members to engage through inline comments and discussions on specific verses. Built with GraphQL, Next.js, and PostgreSQL for a modern, type-safe development experience.

## Features

- **User Authentication** - Role-based access (Leader/Member) with NextAuth.js
- **Session Management** - Leaders create and schedule study sessions
- **Scripture Display** - Verse-level commenting and annotations
- **AI Insights** - Optional Ollama integration for scripture analysis
- **Real-time Discussions** - GraphQL subscriptions for live updates
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
```

### 4. Initialize Database

```bash
npm run db:push      # Create database tables
npm run db:seed      # Add sample data
```

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
npm run db:push          # Sync Prisma schema to database
npm run db:migrate       # Create and run migrations
npm run db:seed          # Seed database with test data
npm run db:studio        # Open Prisma Studio (database GUI)
```

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
docker-compose up -d     # Start all services
docker-compose down      # Stop services

# Kubernetes deployment
cd infra/kubernetes
kubectl apply -f .       # Deploy to cluster
```

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
│   └── docker-compose.yml   # Local development
├── .eslintrc.json           # ESLint + security rules
├── playwright.config.ts     # E2E test configuration
├── sonar-project.properties # SonarQube configuration
├── CLAUDE.md                # Developer guide & architecture
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

See **[CLAUDE.md](./CLAUDE.md)** for:
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

1. Follow the development guidelines in [CLAUDE.md](./CLAUDE.md)
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

MIT

## Support

- **Issues:** Report bugs and request features via GitHub Issues
- **Documentation:** See [CLAUDE.md](./CLAUDE.md) for comprehensive docs
- **Tasks:** Track progress in [TODO.md](./TODO.md)

---

**Built with ❤️ for Bible study communities**
