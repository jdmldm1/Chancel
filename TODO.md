# BibleProject Task List

Last Updated: 2025-11-30

## Project Status: ~75% Complete ✅

This is the **single source of truth** for project status, features, and next steps.
See `CLAUDE.md` for architecture and technical guidelines.

---

## ✅ COMPLETED FEATURES (Verified 2025-11-30)

### Authentication & Authorization
- [x] NextAuth.js with 4 providers (Credentials, Google, Facebook, Apple)
- [x] JWT sessions with 30-day max age
- [x] Role-based access (LEADER/MEMBER)
- [x] Password hashing with bcryptjs
- [x] Bearer token auth for GraphQL
- [x] Pages: `/auth/login`, `/auth/signup`, `/profile`, `/profile/edit`

### Database & GraphQL
- [x] **Complete Prisma schema** with 11 models:
  - User, Session, Series, SessionParticipant, Comment
  - ScripturePassage, SessionResource, Notification
  - ChatMessage, JoinRequest, ScriptureLibrary
- [x] **Apollo Server** with WebSocket support (graphql-ws)
- [x] **Apollo Client** with smart routing (HTTP + WebSocket)
- [x] **GraphQL Subscriptions**: `commentAdded`, `chatMessageAdded`, `userTyping`
- [x] In-memory PubSub for real-time features (single-server only)
- [x] 30+ queries, 20+ mutations, 3 subscriptions

### Session Management
- [x] Full CRUD operations (create, read, update, delete)
- [x] Session types: TOPIC_BASED, SCRIPTURE_BASED
- [x] Session visibility: PUBLIC, PRIVATE
- [x] Series grouping (group sessions by series)
- [x] Scheduled sessions with date/time
- [x] Pages: `/sessions`, `/sessions/[id]`, `/sessions/[id]/edit`, `/series`, `/series/[id]`

### Scripture & Comments
- [x] **Verse-level commenting** on scripture passages
- [x] **Threaded/nested replies** via `parentId`
- [x] **Real-time comment updates** via GraphQL subscriptions
- [x] ScripturePassageCard with verse-by-verse display
- [x] Comments attached to specific verses
- [x] Create, update, delete comments with permissions

### File & Resource Management
- [x] **File upload system** at `/api/upload`
  - 10MB file size limit
  - Supports: PDF, images, Word docs, plain text
  - Files stored in `/public/uploads`
- [x] **Video support** (schema ready):
  - YouTube, Vimeo, direct uploads
  - ResourceType enum in database
  - VideoPlayer component exists
- [x] **Jitsi Meet integration** for video calls
- [x] SessionResources component with upload/delete

### Bible Library
- [x] ScriptureLibrary model (66 books, full KJV)
- [x] Bible browser page at `/bible`
- [x] Search by book/chapter/verse
- [x] Full-text search across scripture
- [x] Seed data populated

### Dashboard & UI
- [x] User dashboard at `/dashboard` with:
  - Session stats (total, participants, comments)
  - Pending join requests
  - Filter: upcoming/past/all sessions
  - Quick actions for leaders
- [x] Enhanced navigation with frosted glass effect
- [x] Collapsible sidebar with role-based sections
- [x] Mobile-responsive hamburger menu
- [x] Toast notification system
- [x] Gradient backgrounds and animations
- [x] Session type filter bar (All, Scripture-based, Topic-based)

### Join Request Workflow
- [x] Send join requests for private sessions
- [x] Accept/reject requests (leader only)
- [x] Three states: PENDING, ACCEPTED, REJECTED
- [x] Access control based on request status

### Real-time Features
- [x] Session chat with real-time updates
- [x] Comment subscriptions
- [x] Typing indicators (schema defined)
- [x] Auto-scroll to latest messages

### Testing Infrastructure
- [x] Vitest configured for unit/integration tests
- [x] Playwright configured for E2E tests
- [x] Test files: `session.resolvers.test.ts`, E2E specs
- [x] Coverage reporting with c8/istanbul

### Docker Support
- [x] docker-compose.yml for full stack
- [x] Multi-service setup (PostgreSQL, API, Web)
- [x] Environment configuration templates

---

## 🔄 PARTIALLY COMPLETE / IN PROGRESS

### Video Embedding
- [x] Database schema ready (ResourceType enum, videoId field)
- [x] VideoPlayer component exists
- [ ] GraphQL schema needs ResourceType enum exposed
- [ ] SessionResources UI needs video URL input
- [ ] Video URL parser utility needed

### Participant Management
- [x] Join/leave session functionality
- [x] SessionParticipant model with role tracking
- [ ] Invite system (send invites to members)
- [ ] Bulk participant management

### Dashboard Analytics
- [x] Basic stats (session count, participants, comments)
- [ ] Engagement metrics (most active users, popular sessions)
- [ ] Session completion tracking
- [ ] Export reports (CSV/PDF)

### Testing Coverage
- [x] Test framework configured
- [x] 1-2 basic resolver tests
- [ ] Comprehensive unit tests for services
- [ ] Frontend component tests
- [ ] Full E2E test suite for user flows
- [ ] 80%+ code coverage target

---

## ❌ NOT STARTED (High Priority)

### Email Notification System
- [ ] Integrate Resend or SendGrid
- [ ] Email templates (comment notifications, join requests, reminders)
- [ ] Notification queue processing
- [ ] Trigger logic for events
- **Note:** Notification model exists in database but no sending logic

### Production-Ready Real-time
- [ ] Replace in-memory PubSub with Redis
- [ ] Enable multi-server scalability
- [ ] GraphQL subscriptions via Redis PubSub
- **Blocker:** Current setup only works with single server instance

### CI/CD Pipeline
- [ ] GitHub Actions workflow
- [ ] Automated testing on PR
- [ ] Security scanning (npm audit, Snyk)
- [ ] Automated deployment to K8s
- [ ] Docker image builds

### DataLoader (Performance)
- [ ] Implement DataLoader for N+1 query prevention
- [ ] Batch user lookups
- [ ] Batch session participant lookups
- [ ] Cache frequently accessed data

### Search & Filtering
- [ ] Full-text search across sessions
- [ ] Search comments by content/author
- [ ] Filter sessions by date range, leader, type
- [ ] Advanced Bible search (keywords, phrases)

### Kubernetes Deployment
- [ ] K8s manifests (Deployment, Service, Ingress)
- [ ] Traefik ingress controller setup
- [ ] PostgreSQL StatefulSet with persistent volumes
- [ ] ConfigMaps and Secrets
- [ ] MinIO for object storage

### Content Moderation
- [ ] Comment flagging/reporting system
- [ ] Admin moderation panel
- [ ] Content filters (profanity, spam)
- [ ] User blocking/banning

---

## ❌ NOT STARTED (Lower Priority)

### Advanced Features
- [ ] Rich text editor for comments (Markdown, formatting)
- [ ] @mentions for notifying participants
- [ ] Mark comments as "resolved"
- [ ] Comment reactions (like, helpful, etc.)
- [ ] Bookmark/favorite sessions
- [ ] Session templates
- [ ] Recurring sessions

### Analytics & Reporting
- [ ] User engagement dashboard
- [ ] Session analytics (views, comments, participants)
- [ ] Export session data
- [ ] Generate session reports

### Accessibility
- [ ] WCAG 2.1 AA compliance audit
- [ ] Keyboard navigation improvements
- [ ] Screen reader optimization
- [ ] High contrast mode
- [ ] Focus indicators

### Documentation
- [ ] API documentation (GraphQL schema docs)
- [ ] Deployment guide (Docker, K8s)
- [ ] User guide with screenshots
- [ ] Developer onboarding guide
- [ ] Architecture decision records (ADRs)

### SonarQube Integration
- [ ] SonarQube server setup
- [ ] Automated code quality scanning
- [ ] Security hotspot detection
- [ ] Technical debt tracking
- **Note:** sonar-project.properties exists but not integrated

---

## 🎯 RECOMMENDED NEXT STEPS (Prioritized)

### Immediate (1-2 hours)
1. **Run pending database migrations**
   ```bash
   cd packages/db && npx prisma db push && npx prisma generate
   ```
2. **Write E2E tests** for critical flows:
   - Login → Create session → Add scripture → Comment
   - Join request workflow (send → accept → verify access)

### Short-term (1 week)
3. **Email notifications** (Resend integration)
   - Comment notifications
   - Join request notifications
   - Session reminders
4. **Complete video embedding UI**
   - Add video URL input to SessionResources
   - Expose ResourceType in GraphQL
   - Test YouTube/Vimeo embeds
5. **Redis PubSub** for production-ready real-time
   - Replace in-memory PubSub
   - Test with multiple server instances

### Medium-term (2-4 weeks)
6. **CI/CD pipeline** with GitHub Actions
   - Automated testing
   - Security scanning
   - Docker builds
7. **DataLoader implementation** for performance
8. **Search functionality** across sessions and comments
9. **Increase test coverage** to 80%+

### Long-term (1-2 months)
10. **Kubernetes deployment** to homelab
11. **Analytics dashboard** with engagement metrics
12. **Content moderation** tools
13. **Comprehensive documentation**

---

## 📊 FEATURE COMPLETION MATRIX

| Category | Completed | In Progress | Not Started | Total | % Complete |
|----------|-----------|-------------|-------------|-------|------------|
| Auth & Users | 6 | 0 | 0 | 6 | 100% |
| Database | 11 | 0 | 0 | 11 | 100% |
| GraphQL API | 50 | 2 | 3 | 55 | 91% |
| Sessions | 8 | 1 | 2 | 11 | 73% |
| Comments | 6 | 0 | 4 | 10 | 60% |
| Files & Video | 5 | 4 | 1 | 10 | 50% |
| Real-time | 4 | 0 | 1 | 5 | 80% |
| Dashboard | 5 | 3 | 2 | 10 | 50% |
| Testing | 3 | 1 | 4 | 8 | 38% |
| DevOps | 1 | 0 | 6 | 7 | 14% |
| **TOTAL** | **99** | **11** | **23** | **133** | **74%** |

---

## 🚨 CRITICAL BLOCKERS

1. **Production Real-time** - In-memory PubSub breaks with multiple servers
   - **Impact:** Cannot scale horizontally
   - **Fix:** Implement Redis PubSub

2. **Test Coverage** - Currently ~5%, need 80%+
   - **Impact:** Cannot safely refactor or deploy
   - **Fix:** Write comprehensive test suite

3. **No CI/CD** - Manual testing and deployment
   - **Impact:** Slower development, more bugs
   - **Fix:** Set up GitHub Actions

4. **No Email Notifications** - Core feature mentioned in CLAUDE.md
   - **Impact:** Poor user engagement
   - **Fix:** Integrate Resend/SendGrid

---

## 📝 NOTES

- **Last major update:** Session types + visual enhancements (2025-11-28)
- **Current version:** ~75% complete (up from 65%)
- **Architecture:** Monorepo with Next.js + Apollo GraphQL + Prisma + PostgreSQL
- **Real-time:** GraphQL Subscriptions (not Socket.IO as originally planned)
- **Files stored:** `/public/uploads` (10MB limit)
- **Dev servers:** Frontend (localhost:3000), API (localhost:4000)
