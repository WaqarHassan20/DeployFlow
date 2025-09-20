# prisma-store

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

---

# Prisma Schema Overview

This package uses [Prisma ORM](https://www.prisma.io/) with PostgreSQL to manage authentication and deployment data for a Next.js application using NextAuth.js.

## Models

### User

- Stores user profile and authentication data.
- Supports NextAuth.js (GitHub, Google, Email, Credentials).
- Fields: `id`, `name`, `email`, `username`, `password`, `image`, `emailVerified`, `accounts`, `sessions`, `projects`.
- Cascade deletes for related accounts, sessions, and projects.

### Account

- OAuth provider account details for NextAuth.js.
- Linked to `User` via `userId` (cascade delete).
- Unique on `[provider, providerAccountId]`.

### Session

- NextAuth.js session management.
- Linked to `User` via `userId` (cascade delete).
- Unique on `sessionToken`.

### VerificationToken

- Used for email verification and password reset flows in NextAuth.js.
- Unique on `[identifier, token]`.

### Project

- Represents a deployable project owned by a user.
- Fields: `id`, `name`, `gitUrl`, `subDomain`, `customDomain`, `userId`.
- Linked to `User` (cascade delete).
- Has many `Deployment` records.

### Deployment

- Tracks deployment status for a project.
- Fields: `id`, `status`, `projectId`.
- Linked to `Project` (cascade delete).
- Status enum: `NOT_STARTED`, `QUEUED`, `IN_PROGRESS`, `READY`, `FAIL`.

## Relationships

- **User** ↔ **Account**: One-to-many
- **User** ↔ **Session**: One-to-many
- **User** ↔ **Project**: One-to-many
- **Project** ↔ **Deployment**: One-to-many

## Usage

- Compatible with [NextAuth.js](https://next-auth.js.org/) for authentication.
- Supports custom deployment management for user projects.
- Cascade deletes ensure referential integrity.

## Migrations & Client Generation

To apply schema changes and generate Prisma client:

```bash
bunx prisma migrate dev
bunx prisma generate
```

## Environment

Set your PostgreSQL connection string in `.env`:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```
