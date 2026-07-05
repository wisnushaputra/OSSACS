# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-05

### Added
- **Monorepo setup**: Initialized monorepo using npm workspaces (`backend`, `frontend`, `packages/*`, and `worker`).
- **Git & Tooling**: Configured `.gitignore`, `tsconfig.json` files, ESLint, and Prettier.
- **Backend Bootstrap**: Created Fastify app server with health endpoint (`/api/health`), global error handler (with subclassed standard errors like `ValidationError`, `NotFoundError`), and TS validation.
- **Database Layer**: Initialized Drizzle ORM schemas (`users`, `roles`, `permissions`, `role_permissions`, `olts`, `customers`, `onus`, `device_status`, `device_events`, `pppoe_profiles`, `wifi_profiles`, `provision_tasks`, `audit_logs`, `refresh_tokens`, `notifications`, `settings`) along with proper foreign keys and index definitions, and generated SQL migrations.
- **Pino Logger**: Added lightweight Pino logger configuration, colorized in development, supporting standard stdout JSON format in production.
- **Worker Project**: Initialized BullMQ background worker along with a simple Redis connectivity config to process queues.
- **Queue Producer**: Set up BullMQ Producer class in Backend and added an HTTP endpoint `POST /api/v1/jobs` to schedule background jobs.
- **Frontend Bootstrap**: Scaffolded Vite React + TS application inside `frontend/` directory.
- **Tailwind CSS**: Set up Tailwind CSS version 4 configuration inside the React project.
- **Routing**: Set up standard routing utilizing `react-router-dom` with child routes and dedicated `ErrorPage`, `HomePage`, and `DashboardPage`.
- **Query & State Management**: Packaged `@tanstack/react-query` wrapper (`QueryProvider`) and Zustand stores (`authStore`, `sidebarStore`, `themeStore`) supporting persistent settings.
- **Base Layout**: Fabricated fully responsive sidebar/header base shell template layout.
- **Theme support**: Added dynamic, persistence-enabled Light/Dark/System theme toggles.
- **Docker Integration**: Wrote `backend.Dockerfile`, `frontend.Dockerfile`, `worker.Dockerfile`, and configured `docker-compose.yml` to orchestrate postgres, redis, backend, frontend, and worker.
- **CI/CD Configuration**: Added automated GitHub Actions workflow (`ci.yml`) to type-check, lint, and build on push.
