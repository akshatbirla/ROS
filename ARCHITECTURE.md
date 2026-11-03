# ARCHITECTURE.md

> **Rotaract OS — Architecture & Data Flow Principles**

---

## 🏛️ Module Boundaries & Layering

Data flows strictly in **one direction**:

```
UI Component → Custom Hook → Service / API Client → Supabase Database
```

1. **Components (`src/components/`, `src/features/<module>/components`)**: Pure visual rendering, user event handlers, local component state.
2. **Hooks (`src/shared/hooks/`, `src/features/<module>/hooks`)**: State synchronization, TanStack Query data fetching, mutation triggers.
3. **Services (`src/services/`, `src/features/<module>/services`)**: Supabase queries, Google Drive API helpers, Zod validation schemas.
4. **Database (Supabase PostgreSQL)**: Single source of truth.

---

## 🧭 Rotary Year Context Isolation

Every feature query must be scoped by the currently selected `RotaryYearContext`. When the user switches Rotary Years in the top navigation bar, TanStack Query cache keys invalidate and refetch data for the newly selected year.
