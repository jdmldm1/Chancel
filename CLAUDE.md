# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BibleProject is a collaborative web application for group Bible study sessions. It enables leaders to organize study sessions with scripture, videos, and resources, while allowing group members to engage through inline comments and discussions on specific scripture passages.

### Core Features

**Current Phase:**
- User authentication and authorization (roles: Leader, Member)
- Session management (create, schedule, manage study sessions)
- Scripture display with inline commenting (verse-level annotations)
- File sharing for study materials
- Real-time discussion threads on scripture passages

**Future Enhancements:**
- Email notifications for discussion activity
- Study session analytics and engagement tracking
- Rich text editor for comments and notes
- Video integration and timestamped references
- Study resources library (commentaries, study guides)

## Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui components
- **GraphQL Client:** graphql-request (lightweight GraphQL client)
- **State Management:** React state + Zustand (for complex state)
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js
- **API Layer:** GraphQL with Apollo Server (flexible querying, better for complex data relationships)
- **Database:** PostgreSQL (primary data store)
- **ORM:** Prisma (type-safe database access with GraphQL integration)
- **Real-time Engine:** GraphQL Subscriptions + Socket.IO (for live comment feeds)
- **Authentication:** NextAuth.js with JWT sessions
- **File Storage:** S3-compatible (MinIO locally, AWS/DigitalOcean in production)
- **Email:** Resend or SendGrid (for notifications)

### Infrastructure
- **Containerization:** Docker (multi-stage builds for frontend and backend)
- **Orchestration:** Kubernetes (K3s for homelab, production-ready options available)
- **Database:** PostgreSQL in container with persistent volumes
- **Reverse Proxy:** Traefik (ingress controller)
- **Environment Config:** ConfigMaps (K8s) or .env files (Docker Compose)

### Testing & Quality Assurance
- **Unit Testing:** Vitest (fast, modern, Vite-native test runner)
- **Integration Testing:** Vitest with test database
- **E2E Testing:** Playwright (cross-browser automation, reliable selectors)
- **Code Coverage:** Built-in Vitest coverage (c8/istanbul)
- **Code Analysis:** SonarQube (hosted on separate Docker server for quality metrics)
- **Linting:** ESLint with TypeScript rules + Prettier
- **Security Scanning:**
  - npm audit (dependency vulnerabilities)
  - Snyk (automated security scanning in CI/CD)
  - OWASP dependency-check (optional deep scanning)
- **Type Safety:** TypeScript strict mode across entire codebase

## Project Structure

```
BibleProject/
├── apps/
│   ├── web/                 # Next.js frontend + graphql-request
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components (organized by feature)
│   │   ├── lib/             # Utilities, helpers, constants
│   │   │   └── graphql-client-new.ts  # GraphQL client configuration
│   │   ├── public/          # Static assets
│   │   ├── __tests__/       # E2E tests (Playwright)
│   │   └── middleware.ts    # Auth middleware
│   └── api/                 # GraphQL API server
│       ├── src/
│       │   ├── graphql/     # GraphQL schema, resolvers, type definitions
│       │   ├── services/    # Business logic layer
│       │   ├── middleware/  # Auth, logging, error handling
│       │   ├── db/          # Database utilities
│       │   └── __tests__/   # API unit/integration tests
│       └── docker/          # Backend-specific Docker config
├── packages/
│   ├── db/                  # Shared database layer (Prisma)
│   │   ├── prisma/          # Schema and migrations
│   │   └── seed/            # Database seed scripts
│   ├── graphql-types/       # Shared GraphQL types (generated)
│   ├── types/               # Shared TypeScript types
│   └── auth/                # Authentication logic
├── infra/                   # Infrastructure as Code
│   ├── kubernetes/          # K8s manifests
│   └── docker-compose.yml   # Local development
├── docker/
│   ├── Dockerfile.web       # Frontend Dockerfile
│   ├── Dockerfile.api       # Backend Dockerfile
│   └── .dockerignore
├── tests/                   # Cross-app E2E tests
│   └── e2e/                 # Playwright test suites
├── sonar-project.properties # SonarQube configuration
└── docker-compose.yml       # Local multi-container setup
```

**Rationale:** Monorepo structure (using Turborepo or Nx) allows shared packages (types, database schemas) while keeping frontend and backend concerns separated. This scales better than single-application approaches.

## Database Schema (High-level)

**Core Tables:**
- `users` - Authentication and profiles (name, email, role)
- `sessions` - Study sessions (title, description, scheduled_date, leader_id)
- `scripture_passages` - Bible text associated with sessions (book, chapter, verse, content)
- `comments` - Thread-based comments on scripture passages (user_id, passage_id, content, parent_id)
- `session_resources` - Files/links shared in sessions (session_id, file_url, description)
- `session_participants` - Membership tracking (session_id, user_id, role)
- `notifications` - Email/notification queue (user_id, type, content, sent_at)

Use Prisma for schema management and migrations.

## Development Workflow

### Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repo>
   cd BibleProject
   npm install
   # or yarn install / pnpm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with local values (DB connection, API keys)
   ```

3. **Database setup:**
   ```bash
   npm run db:push          # Sync schema with local database
   npm run db:seed          # Optional: seed test data
   ```

4. **Start development servers:**
   ```bash
   npm run dev              # Starts all services (Next.js + backend if separate)
   ```

### Common Commands

**Development:**
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Lint code
npm run type-check       # TypeScript type checking
npm run format           # Format with Prettier
npm run codegen          # Generate GraphQL types from schema
```

**Database:**
```bash
npm run db:push          # Sync schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:studio        # Open Prisma Studio for data exploration
```

**Testing:**
```bash
npm run test             # Run all unit/integration tests
npm run test:watch       # Watch mode for unit tests
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with Playwright UI
npm run test:e2e:debug   # Debug E2E tests
```

**Code Quality & Security:**
```bash
npm run lint             # ESLint + Prettier checks
npm run lint:fix         # Auto-fix linting issues
npm audit                # Check for dependency vulnerabilities
npm run security:check   # Run Snyk security scan
npm run sonar:scan       # Run SonarQube analysis (requires SonarQube server)
```

**Docker:**
```bash
docker-compose up -d     # Start all services locally
docker-compose down      # Stop services
docker compose logs -f   # View logs
```

**Kubernetes (Homelab):**
```bash
cd infra/kubernetes
kubectl apply -f .       # Deploy to cluster
kubectl get pods -n bibleproject
kubectl logs -f <pod-name> -n bibleproject
```

## Deployment Architecture

### Local Development (Docker Compose)
- PostgreSQL container with persistent volume
- Next.js development server (auto-reload)
- Optional: MinIO for S3-compatible storage
- Access via http://localhost:3000

### Kubernetes (Production/Homelab)

**Services:**
- Frontend (Next.js) - stateless deployment
- Backend API - stateless deployment (if separate)
- PostgreSQL - StatefulSet with PersistentVolumeClaim
- MinIO - object storage for file uploads
- Traefik - ingress controller with TLS

**Networking:**
- Service-to-service communication via internal DNS
- External access via Traefik ingress with TLS certificates
- Environment variables via ConfigMaps for configuration
- Secrets for sensitive data (DB passwords, API keys)

## Authentication & Authorization

**Roles:**
- `LEADER` - Creates sessions, manages content, views analytics
- `MEMBER` - Joins sessions, reads scripture, posts comments

**Implementation:**
- NextAuth.js for session management
- JWT tokens stored in HTTP-only cookies
- Middleware to protect API routes and pages
- Row-level security (RLS) in PostgreSQL for additional safety

## GraphQL Implementation

**Schema Design:**
- Schema-first approach using GraphQL SDL (Schema Definition Language)
- Automatically generate TypeScript types from GraphQL schema using GraphQL Code Generator
- Co-locate resolvers with business logic in services layer

**Query Optimization:**
- DataLoader for batching and caching database queries (N+1 problem prevention)
- Field-level authorization with custom directives (@auth, @hasRole)
- Complexity analysis to prevent expensive queries
- Query depth limiting for security

**Code Generation:**
- GraphQL Code Generator for client-side type safety
- Shared types package for frontend/backend consistency
- Auto-generate TypeScript types from GraphQL schema

## Real-time Features

**GraphQL Subscriptions:**
- Live comment updates when other users post via GraphQL subscriptions
- Typing indicators for active commenters
- Real-time notification of new discussion threads
- WebSocket-based subscriptions using graphql-ws protocol

**Fallback:**
- Socket.IO for real-time features not suited to GraphQL subscriptions (e.g., presence detection)

## File Upload Strategy

**Local Development:**
- Use MinIO (S3-compatible) in Docker Compose
- Files stored in container volumes

**Production:**
- S3 (AWS), DigitalOcean Spaces, or MinIO
- Presigned URLs for secure download
- Validate file types and size limits on both client and server

## Key Architectural Decisions

1. **Monorepo:** Easier to manage shared code (types, database schemas, GraphQL types) across frontend and backend
2. **GraphQL over REST:** Flexible querying reduces over-fetching, strongly typed schema, excellent tooling for complex data relationships
3. **PostgreSQL:** Reliable ACID compliance, excellent JSON support for flexible data, proven at scale
4. **graphql-request over Apollo Client:** Lightweight GraphQL client (smaller bundle size, simpler implementation) for frontend, Apollo Server for backend
5. **Prisma:** Type-safe database access, automatic migrations, intuitive API, integrates well with GraphQL
6. **Vitest over Jest:** Faster test execution, native ESM support, better Vite integration
7. **Playwright for E2E:** Modern, reliable cross-browser testing with better selector strategies than Selenium
8. **SonarQube:** Comprehensive code quality metrics, security vulnerability detection, technical debt tracking
9. **Tailwind + shadcn/ui:** Fast UI development, consistent design system

## Important Notes for Development

- **Database Migrations:** Always create Prisma migrations before schema changes (`npx prisma migrate dev`)
- **GraphQL Schema:** After updating GraphQL schema, run `npm run codegen` to regenerate types
- **Environment Variables:** Never commit `.env.local` or secrets. Use `.env.example` as template
- **Business Logic:** Keep business logic in services layer, resolvers should be thin wrappers
- **Comments Threading:** Design comments with `parent_id` field to support nested discussions
- **File Uploads:** Always validate on server-side, not just client-side
- **Testing Strategy:**
  - Unit tests for services and utilities (Vitest)
  - Integration tests for GraphQL resolvers with test database
  - E2E tests for critical user flows (Playwright)
  - Aim for 80%+ code coverage on business logic
- **Type Safety:** Auto-generate types from GraphQL schema, never manually write API types
- **Security:** Run `npm audit` before committing, fix high/critical vulnerabilities immediately
- **Code Quality:** Run SonarQube scans regularly, address code smells and security hotspots

## Useful Links

**Core Framework:**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)

**GraphQL:**
- [GraphQL Spec](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [graphql-request Documentation](https://github.com/jasonkuhrt/graphql-request)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
- [Pothos GraphQL](https://pothos-graphql.dev/) (code-first schema)

**Testing:**
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

**Code Quality:**
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [ESLint Documentation](https://eslint.org/docs/)
- [Snyk Security](https://snyk.io/learn/)

**Infrastructure:**
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs)
