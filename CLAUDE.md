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
- **Real-time:** Socket.IO or tRPC subscriptions (for live comments)
- **State Management:** React Query + Zustand (or similar)
- **Forms:** React Hook Form + Zod validation

### Backend
- **Runtime:** Node.js
- **Framework:** tRPC + Express OR Next.js API routes with middleware
- **Database:** PostgreSQL (primary data store)
- **Real-time Engine:** Socket.IO (for live comment feeds)
- **Authentication:** NextAuth.js with JWT sessions
- **File Storage:** S3-compatible (MinIO locally, AWS/DigitalOcean in production)
- **Email:** Resend or SendGrid (for notifications)

### Infrastructure
- **Containerization:** Docker (multi-stage builds for frontend and backend)
- **Orchestration:** Kubernetes (K3s for homelab, production-ready options available)
- **Database:** PostgreSQL in container with persistent volumes
- **Reverse Proxy:** Traefik (ingress controller)
- **Environment Config:** ConfigMaps (K8s) or .env files (Docker Compose)

## Project Structure

```
BibleProject/
├── apps/
│   ├── web/                 # Next.js frontend + API routes
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components (organized by feature)
│   │   ├── lib/             # Utilities, helpers, constants
│   │   ├── public/          # Static assets
│   │   └── middleware.ts    # Auth middleware
│   └── api/                 # Separate backend (if not using Next.js API routes)
│       ├── src/
│       │   ├── routes/      # API endpoints
│       │   ├── services/    # Business logic
│       │   ├── middleware/  # Auth, logging, error handling
│       │   └── db/          # Database schemas, migrations
│       └── docker/          # Backend-specific Docker config
├── packages/
│   ├── db/                  # Shared database layer (Prisma)
│   ├── types/               # Shared TypeScript types
│   └── auth/                # Authentication logic
├── infra/                   # Infrastructure as Code
│   ├── kubernetes/          # K8s manifests
│   └── docker-compose.yml   # Local development
├── docker/
│   ├── Dockerfile.web       # Frontend Dockerfile
│   ├── Dockerfile.api       # Backend Dockerfile
│   └── .dockerignore
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
```

**Database:**
```bash
npm run db:push          # Sync schema to database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:studio        # Open Prisma Studio for data exploration
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

**Testing:**
```bash
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
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

## Real-time Features

**Socket.IO Implementation:**
- Live comment updates when other users post
- Typing indicators for active commenters
- Real-time notification of new discussion threads

**Alternative:** tRPC with WebSocket subscriptions for a more integrated solution.

## File Upload Strategy

**Local Development:**
- Use MinIO (S3-compatible) in Docker Compose
- Files stored in container volumes

**Production:**
- S3 (AWS), DigitalOcean Spaces, or MinIO
- Presigned URLs for secure download
- Validate file types and size limits on both client and server

## Key Architectural Decisions

1. **Monorepo:** Easier to manage shared code (types, database schemas) across frontend and backend
2. **PostgreSQL:** Reliable ACID compliance, excellent JSON support for flexible data, proven at scale
3. **Next.js for everything:** Simplifies deployment (single container), reduces operational complexity
4. **Socket.IO over polling:** Better UX for real-time comments, reduces server load
5. **Prisma:** Type-safe database access, automatic migrations, intuitive API
6. **Tailwind + shadcn/ui:** Fast UI development, consistent design system

## Important Notes for Development

- **Database Migrations:** Always create Prisma migrations before schema changes (`npx prisma migrate dev`)
- **Environment Variables:** Never commit `.env.local` or secrets. Use `.env.example` as template
- **API Routes:** Keep business logic in `/lib` or separate services, not in route handlers
- **Comments Threading:** Design comments with `parent_id` field to support nested discussions
- **File Uploads:** Always validate on server-side, not just client-side
- **Testing:** Prioritize integration tests for API endpoints and comment functionality
- **Type Safety:** Keep frontend and backend types in sync using shared `packages/types`

## Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Kubernetes Documentation](https://kubernetes.io/docs)
