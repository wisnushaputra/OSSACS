# Documentation Index

## Core Requirements & Specifications

- [01-prd.md](01-prd.md) – Product Requirements (goals, user roles, high-level features, success metrics)
- [02-architecture.md](02-architecture.md) – System Architecture Overview
- [03-olt-adapter-spec.md](03-olt-adapter-spec.md) – OLT Adapter interface, factory pattern, common utilities
- [03-vendor-mapping.md](03-vendor-mapping.md) – Vendor → internal status, alarm, command, parameter mappings
- [04-api-spec.md](04-api-spec.md) – API contract (OpenAPI/GraphQL)
- [05-database-spec.md](05-database-spec.md) – Drizzle schema, migrations, indexes, seed data
- [06-coding-standards.md](06-coding-standards.md) – TypeScript strictness, naming conventions, linting, CI rules
- [07-react-guidelines.md](07-react-guidelines.md) – React Component Architecture & Frontend Guidelines
- [08-deployment-spec.md](08-deployment-spec.md) – Docker images, Compose, Nginx, CI/CD pipeline expectations

## Deep-dives & Domain Subsystems

- [cache-strategy.md](cache-strategy.md) – Redis Caching mechanism and details
- [configuration.md](configuration.md) – Environmental variables & application setup configuration
- [design-system.md](design-system.md) – UI/UX tokens and components guidelines
- [domain-model.md](domain-model.md) – Internal aggregates, entities and models mapping
- [error-handling.md](error-handling.md) – Global exception handling strategy & maps
- [event-bus.md](event-bus.md) – Local & Distributed Event bus details
- [folder-structure.md](folder-structure.md) – Physical structure maps
- [genieacs-integration.md](genieacs-integration.md) – External integration with GenieACS API
- [job-queue.md](job-queue.md) – Asynchronous jobs running patterns with BullMQ
- [observability.md](observability.md) – Logging (Pino), Metrics (Prometheus), Trace (OpenTelemetry)
- [permission-matrix.md](permission-matrix.md) – RBAC matrix details
- [project-blueprint.md](project-blueprint.md) – General blueprint details
- [security.md](security.md) – Security standards & protections
- [socket-events.md](socket-events.md) – Realtime namespaces & payloads definitions
- [state-machine.md](state-machine.md) – State machine transitions description (ONU status lifecycle)
- [workflow-engine.md](workflow-engine.md) – Provisioning workflows definitions

## Planning

- [planning/](planning/) – Subfolder for roadmap, backlogs & tasks tracking
  - [planning/implementation-roadmap.md](planning/implementation-roadmap.md) – Execution timeline phases
  - [planning/tasks/](planning/tasks/) – Atomic execution tasks checklist
