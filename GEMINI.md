# GEMINI.md

This file provides a comprehensive overview of the BibleProject application, intended to be used as a quick-start guide and reference for developers.

## Project Overview

BibleProject is a collaborative web application for group Bible study sessions. It enables study leaders to organize sessions with scripture passages, videos, and resources, while allowing group members to engage through real-time commenting and discussion on specific verses.

The project is a monorepo built with Turborepo and contains a Next.js frontend, a GraphQL API backend, and shared packages for database, types, and authentication.

### Key Technologies

*   **Frontend:** Next.js, React, Tailwind CSS, Apollo Client, Zustand
*   **Backend:** Node.js, Express, GraphQL, Apollo Server
*   **Database:** PostgreSQL with Prisma ORM
*   **Authentication:** NextAuth.js
*   **Testing:** Vitest (unit/integration), Playwright (E2E)
*   **Monorepo:** Turborepo with npm workspaces

### Future Enhancements

*   Email notifications for discussion activity
*   Study session analytics and engagement tracking
*   Rich text editor for comments and notes
*   Video integration and timestamped references
*   Study resources library (commentaries, study guides)

## Building and Running

### Prerequisites

*   Node.js 18+
*   PostgreSQL 14+
*   npm

### 1. Installation

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and configure the `DATABASE_URL` in a `.env` file (copied from `.env.example`).

### 3. Initialize Database

```bash
npm run db:push
npm run db:seed
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