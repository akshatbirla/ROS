# Rotaract Operating System (ROS)

> **Institutional Digital Operating System for the Rotaract Club of Acropolis Royals**

ROS is a permanent, high-performance, dark-luxury digital operating system designed to manage all operations of a Rotaract Club across multiple Rotary Years. It replaces scattered spreadsheets, manual registers, loose forms, and unorganized Drive folders with a single, unified command center.

---

## 🛠️ Stack Architecture

- **Frontend**: React 19, TypeScript (Strict Mode), Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, TanStack Query, Zustand.
- **Backend & Database**: Supabase (PostgreSQL).
- **File System Storage**: Google Drive (metadata stored in Supabase).
- **Import/Export Bridge**: Google Sheets (strictly for data bridge and advisor exports).

---

## 📁 Repository Structure

```
Rotaract OS/
├── apps/
│   └── web/                     # Primary Web Application (Vite + React + TS)
├── docs/                        # Complete Engineering Documentation
│   ├── MASTER_PROMPT.md
│   ├── MASTER_PLAN.md
│   ├── ROADMAP.md
│   ├── CHANGELOG.md
│   ├── DECISION_LOG.md
│   ├── DATABASE.md
│   ├── ARCHITECTURE.md
│   └── API.md
```
