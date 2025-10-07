# Simple Task Manager (Next.js + Supabase + Prisma)

A minimal task manager where each user can sign up, sign in, and manage **their own** tasks (create, edit, delete, view).

## Tech Stack

- Next.js (App Router) + TypeScript
- Supabase (Auth + Postgres)
- Prisma ORM (schema & migrations)
- Tailwind CSS
- Formik + Yup (forms & validation)
- React Toastify (UX feedback)
- Redux Toolkit (client state)

---

## Features

- Email/password auth via Supabase
- Protected routes (unauthenticated users are redirected to `/signin`)
- Per-user tasks with strict **RLS**: users only see and mutate their own rows
- CRUD:
  - Create task (title, description, status, position)
  - Edit task (RPC: `edit_task_rpc`)
  - Delete task (RPC: `delete_task_rpc`)
  - List own tasks (RLS-scoped `select`)
- Single form for create/edit with **EditTaskContext** to prefill on “Edit”
- Toast feedback and optimistic Redux updates

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl   = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TaskStatus {
  TODO
  DOING
  DONE
}

model Task {
  id          String     @id @db.Text            @map("id")
  userId      String     @db.Text               @map("userId")
  title       String     @db.Text               @map("title")
  description String     @db.Text               @map("description")
  status      TaskStatus @db.Enum("TaskStatus") @map("status")
  position    Int                              @map("position")
  createdAt   DateTime?                        @map("createdAt")
  updatedAt   DateTime?                        @map("updatedAt")

  @@map("Task")
}

## How We Structured the Code

/
├─ 🗄 db/
│  └─ 🧾 sql/
│     └─ 🧩 task_policies_and_rpcs.sql    # RLS policies, RPCs (create/edit/delete), trigger, NOTIFY pgrst
├─ 💎 prisma/
│  ├─ 🧾 schema.prisma                  # Prisma models (mapped to Supabase tables/enums)
│  └─ 📦 migrations/                    # Prisma migrations applied to Supabase Postgres
├─ 🌐 public/                            # Static assets (favicons, images)
├─ 🧠 src/
│  ├─ ⚡ actions/                        # Server Actions (auth helpers, lightweight server ops)
│  ├─ 🚪 app/
│  │  ├─ 🔐 (auth)/                      # Public auth routes
│  │  │  ├─ 🔑 login/page.tsx
│  │  │  └─ 📝 register/page.tsx
│  │  ├─ 🗂 page.tsx                     # Protected dashboard entry (tasks UI)
│  │  ├─ 🧱 layout.tsx                   # Root layout
│  │  └─ 🎨 globals.css                  # Global styles (Tailwind base/components/utilities)
│  ├─ 🧩 components/
│  │  ├─ 🖲 buttons/                     # Reusable buttons (e.g., ValidatingFormSubmitButton)
│  │  ├─ 🧾 form/                        # Formik wrappers & fields (FormComponent, inputs)
│  │  └─ ✅ tasks/                       # Task UI (TaskCenter, list/cards)
│  ├─ 🧭 context/
│  │  └─ ✏️ EditTaskContext.tsx          # Holds editingId + derives live task from Redux
│  ├─ 🪝 hooks/
│  │  └─ ✅ tasks/                       # useFetchTask(s), useCreateTask, useEditTask, useDeleteTask
│  ├─ 🧰 lib/                            # Small utilities/types (date, yup helpers, misc)
│  ├─ 🧱 redux/
│  │  ├─ 🧩 slices/
│  │  │  └─ ✅ tasksSlice.ts             # Task state, selectors, actions (taskAdded/Updated/Deleted)
│  │  └─ 🧰 store.ts                     # Redux store setup & typed hooks
│  ├─ 🗺 routes/                          # Route constants (public/protected), URL helpers
│  ├─ 📐 schemas/
│  │  └─ ✅ task.schema.ts               # Yup schema + Task form types
│  └─ 🧰 utils/
│     └─ 🐣 supabase/
│        ├─ 🌍 client.ts                 # Browser Supabase client (anon key)
│        ├─ 🖥  server.ts                 # Server-side Supabase client (cookies aware)
│        └─ 🧩 middleware.ts             # Session persistence helpers used by Next middleware
├─ 🧩 middleware.ts                      # Next.js middleware wiring Supabase session cookies
├─ 📘 README.md
└─ 📦 package.json


## Database Setup (RLS, RPCs & Triggers)

All database policies & functions are versioned in this repo so anyone can reproduce the exact DB state.


### What’s included

- **RLS** enabled on `public."Task"`.
- **Owner-only policies** for `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- **RPCs**
  - `create_task_rpc(p_user_id text, p_title text, p_description text, p_status "TaskStatus")`
  - `edit_task_rpc(p_task_id text, p_body jsonb)`  *(casts `status` to `"TaskStatus"` safely)*
  - `delete_task_rpc(p_task_id text)`
- **Trigger** `task_updated_at_trigger` to auto-update `"updatedAt"` on changes.
- **Schema refresh** via `NOTIFY pgrst, 'reload schema'`.

### How to apply

**Option A — Supabase SQL Editor**
1. Open your project → **SQL** → **New Query**.
2. Paste the contents of `db/sql/task_policies_and_rpcs.sql`.
3. Run.

**Option B — CLI (psql)**
```bash
psql "$DATABASE_URL" -f db/sql/task_policies_and_rpcs.sql
