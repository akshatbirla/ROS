# DATABASE.md

> **Rotaract OS — Supabase PostgreSQL Schema & Data Dictionary**

All data in ROS belongs to a **Rotary Year** (`rotary_years` table).

---

## 📊 Core Entity Relationships

```
rotary_years
  ├── members (club membership records)
  ├── avenues (club avenues of service)
  │    ├── events
  │    │    ├── attendance_records
  │    │    └── event_budgets
  │    ├── meetings
  │    └── reports
  └── financial_transactions
```

---

## 🗄️ Database Tables (DDL Summary)

### 1. `rotary_years`
- `id` (uuid, PK)
- `theme_name` (text) - e.g., "Magic of Rotary"
- `start_date` (date) - July 1st
- `end_date` (date) - June 30th
- `is_active` (boolean)
- `created_at` (timestamptz)

### 2. `members`
- `id` (uuid, PK)
- `rotary_year_id` (uuid, FK -> rotary_years.id)
- `full_name` (text)
- `email` (text)
- `phone` (text)
- `academic_year_section` (text) - e.g., "3rd Year CS-A"
- `role` (text) - President, Secretary, Treasurer, Director, Member
- `avenue` (text) - Club Service, Community Service, Vocational, International, Professional, Finance
- `discipline_score` (integer) - Default 100
- `status` (text) - Active, Alumni, Inactive
- `created_at` (timestamptz)

### 3. `events`
- `id` (uuid, PK)
- `rotary_year_id` (uuid, FK -> rotary_years.id)
- `avenue` (text)
- `title` (text)
- `description` (text)
- `event_date` (timestamptz)
- `location` (text)
- `status` (text) - Upcoming, In Progress, Completed, Cancelled
- `budget_allocated` (numeric)
- `budget_spent` (numeric)
- `created_at` (timestamptz)

### 4. `attendance_records`
- `id` (uuid, PK)
- `event_id` (uuid, FK -> events.id)
- `member_id` (uuid, FK -> members.id)
- `attended` (boolean)
- `check_in_time` (timestamptz)
- `club_coordinator_name` (text)
- `club_coordinator_gmail` (text)
- `created_at` (timestamptz)

### 5. `financial_transactions`
- `id` (uuid, PK)
- `rotary_year_id` (uuid, FK -> rotary_years.id)
- `type` (text) - Income, Expense
- `category` (text) - Dues, Event Budget, Sponsorship, Administrative
- `amount` (numeric)
- `description` (text)
- `transaction_date` (date)
- `receipt_drive_file_id` (text) - Metadata link to Google Drive
- `created_at` (timestamptz)
