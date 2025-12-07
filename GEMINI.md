# GEMINI.md

This file provides a comprehensive overview of the BibleProject application, intended to be used as a quick-start guide and reference for developers.

## Project Overview

BibleProject is a collaborative web application for group Bible study sessions. It enables study leaders to organize sessions with scripture passages, videos, and resources, while allowing group members to engage through real-time commenting and discussion on specific verses.

The project is a monorepo built with Turborepo and contains a Next.js frontend, a GraphQL API backend, and shared packages for database, types, and authentication.

### Key Technologies

*   **Frontend:** Next.js, React, Tailwind CSS, Apollo Client, Zustand
*   **Backend:** Node.js, Express, GraphQL, Apollo Server, graphql-ws
*   **Database:** PostgreSQL with Prisma ORM
*   **Authentication:** NextAuth.js
*   **Testing:** Vitest (unit/integration), Playwright (E2E)
*   **Monorepo:** Turborepo with npm workspaces

### Project Status

The project has completed its foundational and core feature development phases. The backend API and database are robust, and the frontend has implemented the primary user flows for session management and commenting. The current focus is on building out user dashboards, implementing new pre-loading and video features, and preparing for deployment.

#### ✅ Completed Features

*   **Full Authentication:** User registration, login, and role management (Leader/Member) with NextAuth.js.
*   **Session Management:** Full CRUD (Create, Read, Update, Delete) functionality for Bible study sessions.
*   **Scripture Display:** Dynamically renders scripture passages with verse-by-verse organization.
*   **Real-Time Commenting:** Users can comment on specific verses, with threaded replies and real-time updates via GraphQL Subscriptions.
*   **File Sharing:** Leaders can upload and share resources (PDFs, documents) within a session.
*   **Database Schema:** A comprehensive PostgreSQL schema managed with Prisma, covering all core features.

#### 🔄 In Progress / Partially Complete

*   **Video Embedding:** Backend schema is ready to support YouTube, Vimeo, and direct video uploads. UI and API logic are the next steps.
*   **Bible Pre-loading System:** The database schema and import scripts are ready to pre-load the entire Bible, enabling faster session setup. UI and data migration are pending.
*   **Participant Management:** Users can join and leave sessions, but a formal invitation system is not yet implemented.
*   **Testing Coverage:** The project has an established testing foundation with Vitest and Playwright, but test coverage needs to be expanded.

#### 🚀 Key Next Steps

1.  **Implement Video Player UI:** Build the `VideoPlayer.tsx` component and related UI to allow leaders to embed videos from various sources.
2.  **Build "Browse Bible" Page:** Create the frontend components for the Bible pre-loading system so leaders can easily search for and add scripture passages to sessions.
3.  **Develop User Dashboards:** Create dedicated dashboard experiences for both Study Leaders (session planning, analytics) and Members (upcoming sessions, recent activity).
4.  **Containerize Application:** Create Dockerfiles and a `docker-compose.yml` to streamline local development and prepare for production deployment.

#### 🛣️ Future Roadmap

*   **Email Notifications:** Integrate an email service for notifications on new comments, session invitations, and other activities.
*   **Comprehensive Testing:** Increase unit, integration, and E2E test coverage to ensure application stability and reliability.
*   **Deployment:** Build Kubernetes manifests and a CI/CD pipeline for automated deployment.
*   **Advanced Features:** Implement session analytics, comment editing/@mentions, and full-text search.

## Building and Running

### Prerequisites

*   Node.js 18+
*   PostgreSQL 14+
*   npm
*   turbo (run `npm install -g turbo`)

### 1. Installation

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and configure the `DATABASE_URL` in a `.env` file (copied from `.env.example`).

### 3. Initialize Database

```bash
npm -w @bibleproject/db run db:push
npm -w @bibleproject/db run db:seed
```

### 4. Start Development Servers

```bash
npm run dev
```

*   Frontend: `http://localhost:3000`
*   GraphQL API: `http://localhost:4000/graphql`

## Development Conventions

*   **Code Style:** ESLint and Prettier are used for code linting and formatting.
*   **Testing:** Unit and integration tests are written with Vitest, and end-to-end tests with Playwright.
*   **Commits:** Conventional commit messages are recommended.
*   **GraphQL:** The GraphQL schema is located in `apps/api/src/graphql/schema/typeDefs.ts`. Resolvers are in `apps/api/src/graphql/resolvers`.

## Key Architectural Decisions

1.  **Monorepo:** Easier to manage shared code (types, database schemas, GraphQL types) across frontend and backend.
2.  **GraphQL over REST:** Flexible querying reduces over-fetching, strongly typed schema, excellent tooling for complex data relationships.
3.  **PostgreSQL:** Reliable ACID compliance, excellent JSON support for flexible data, proven at scale.
4.  **Apollo Client + Server:** Industry-standard GraphQL implementation with excellent caching, subscriptions, and developer tools.
5.  **Prisma:** Type-safe database access, automatic migrations, intuitive API, integrates well with GraphQL.
6.  **Vitest over Jest:** Faster test execution, native ESM support, better Vite integration.
7.  **Playwright for E2E:** Modern, reliable cross-browser testing with better selector strategies than Selenium.
8.  **SonarQube:** Comprehensive code quality metrics, security vulnerability detection, technical debt tracking.
9.  **Tailwind + shadcn/ui:** Fast UI development, consistent design system.

## Project Structure

```
BibleProject/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # GraphQL API server
├── packages/
│   ├── db/                  # Prisma schema & seed data
│   ├── types/               # Shared TypeScript types
│   └── auth/                # Authentication logic
└── tests/
    └── e2e/                 # E2E tests
```

## Key Files

*   `README.md`: Detailed project documentation.
*   `package.json`: Project dependencies and scripts.
*   `turbo.json`: Turborepo configuration.
*   `apps/web/app/page.tsx`: The main entry point for the Next.js application.
*   `apps/api/src/index.ts`: The main entry point for the GraphQL API.
*   `packages/db/prisma/schema.prisma`: The database schema.