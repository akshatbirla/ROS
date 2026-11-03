# DECISION_LOG.md

> **Architecture Decision Records (ADRs) for Rotaract OS**

---

## ADR 001: Monorepo & Feature-First Directory Layout
- **Date**: August 2026
- **Status**: Approved
- **Context**: The application must scale from single-club usage (Acropolis Royals) to District 3040 and multi-club deployments without requiring structural rewrites.
- **Decision**: Adopt a monorepo setup using `pnpm` workspaces. Organize web application code inside `apps/web/src/features/` by feature domain rather than technical type (e.g., `features/members/`, `features/events/`).
- **Consequences**: Ensures clean module boundaries, single-direction data flow, and isolated code ownership.

---

## ADR 002: Staged Authentication Architecture
- **Date**: August 2026
- **Status**: Approved
- **Context**: Rapid solo development requires immediate UI validation without login friction, while production rollout requires strict RBAC (Role Based Access Control).
- **Decision**: Implement V1 as an unlocked application shell with built-in role switcher preview. Prepare schema definitions with `owner_id` and `created_by` attributes from day one to ensure seamless Supabase Auth integration in V2.

---

## ADR 003: Faculty Advisor Attendance Export Format
- **Date**: August 2026
- **Status**: Approved
- **Context**: Faculty advisors require a specific 5-column attendee report format for college record compliance.
- **Decision**: Build a specialized report generator component inside `features/attendance/` that outputs event metadata headers followed by rows matching:
  1. Serial Number
  2. Rotaractor Name
  3. Year & Section
  4. Club Coordinator Name
  5. Club Coordinator Gmail
