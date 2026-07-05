# Agents

High-signal configuration and workflow notes for development.

## Commands

- `npm run dev:backend`: Starts the backend API server using `tsx watch` for live reloading.
- `npm run dev:frontend`: Starts the frontend development server using `vite`.
- `npm run build`: Builds all workspaces.
- `npm run lint`: Runs ESLint on TypeScript/TSX files. Note that `frontend` also uses `oxlint`.
- `npm run format`: Formats all supported files with Prettier.
- `npm run test`: Runs tests across all workspaces (currently, only `frontend` has a test script defined).
- `npm run db:generate` (backend): Generates Drizzle migrations based on schema changes.
- `npm run db:migrate` (backend): Applies pending Drizzle migrations.
- `npm run db:seed` (backend): Seeds the database.
- `npm run db:studio` (backend): Starts Drizzle Studio for database inspection.

## Architecture

- Monorepo using npm workspaces: `backend`, `frontend`, `packages/*` (shared-types, socket-contracts, shared-utils), and `worker`.
- **Backend:** Fastify, Drizzle ORM (PostgreSQL), BullMQ for queueing, Redis (via `ioredis`). Uses `tsx` for development.
- **Frontend:** React, Vite, Tailwind CSS, Tanstack Query/Router, Zustand. Uses `oxlint` for linting in addition to ESLint.
- **Worker:** BullMQ workers, IORedis. Uses `tsx` for development.
- **Database:** PostgreSQL managed by Drizzle ORM. Connection URL is from `DATABASE_URL` environment variable or defaults to `postgresql://postgres:password@localhost:5432/bcms_db`.

## Conventions

- **Linting:** Global ESLint for `.ts`, `.tsx` files; `frontend` also uses `oxlint`.
- **Formatting:** Prettier for consistent code style.
- **Database Migrations:** Drizzle-kit commands (`db:generate`, `db:migrate`).
