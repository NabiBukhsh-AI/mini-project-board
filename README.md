# 📋 Mini Project Board

A full-stack project and task management application where authenticated users can create projects, manage tasks, filter and sort work, and track progress through a Kanban-style board.

---

## Table of Contents

- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Features Completed](#features-completed)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Assumptions & Tradeoffs](#assumptions--tradeoffs)
- [Future Improvements](#future-improvements)

---

## Technologies Used

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Backend     | Node.js, Express.js                             |
| Database    | MySQL 8 / MariaDB                               |
| ORM         | Prisma                                          |
| Auth        | JWT (jsonwebtoken), bcryptjs                    |
| Validation  | Zod                                             |
| Frontend    | React 18, React Router v6                       |
| HTTP Client | Axios                                           |
| Styling     | Plain CSS (component-scoped)                    |
| DevOps      | Docker, docker-compose                          |

---

## Architecture

The backend follows a strict **layered architecture**:

```
Request → Router → Controller → Service → Repository → Prisma → MySQL
```

- **Controllers** — parse HTTP requests and send responses. Zero business logic.
- **Services** — own all business rules, validation, and ownership enforcement.
- **Repositories** — the only layer that touches Prisma/database directly.
- **Middleware** — authentication, request validation, and error handling are cross-cutting concerns handled independently.
- **Validators** — Zod schemas co-located with their domain, applied as middleware before controllers run.

The frontend uses a **hooks-first** pattern:

```
Page Component → Custom Hook (useProjects / useTasks) → Service Module → Axios → API
```

- `AuthContext` manages global auth state via `useReducer`
- Custom hooks abstract all data-fetching and mutation logic
- Service modules contain all Axios calls — components never call Axios directly

---

## Features Completed

| Feature | Status |
|---|---|
| User registration & login | ✅ |
| Password hashing with bcrypt | ✅ |
| JWT authentication | ✅ |
| Protected API routes | ✅ |
| Protected frontend routes | ✅ |
| Users can only access their own data | ✅ |
| Create / view / rename / delete projects | ✅ |
| Task count displayed per project | ✅ |
| Create / edit / delete tasks | ✅ |
| Change task status (inline dropdown) | ✅ |
| Filter tasks by status | ✅ |
| Sort tasks by due date | ✅ |
| Sort tasks by priority (high → medium → low) | ✅ |
| Kanban-style board (To Do / In Progress / Done columns) | ✅ |
| Overdue task highlighting | ✅ |
| Soft deletes for projects and tasks | ✅ |
| Centralized error handling | ✅ |
| Input validation with Zod | ✅ |
| Consistent API response envelope | ✅ |
| Docker + docker-compose setup | ✅ |

---

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/            # Environment validation, Prisma singleton
│   │   ├── controllers/       # Thin HTTP handlers (no business logic)
│   │   ├── services/          # Business logic + ownership enforcement
│   │   ├── repositories/      # All database access via Prisma
│   │   ├── middleware/        # authenticate, validate, errorHandler
│   │   ├── routes/            # Route definitions with middleware chains
│   │   ├── validators/        # Zod schemas per domain
│   │   └── utils/             # JWT helpers, response helpers
│   └── prisma/
│       └── schema.prisma      # Database schema
├── frontend/
│   └── src/
│       ├── pages/             # Route-level page components
│       ├── components/        # Reusable UI components
│       ├── services/          # Axios API wrappers
│       ├── hooks/             # Data-fetching hooks (useProjects, useTasks)
│       ├── context/           # AuthContext (global auth state)
│       └── utils/             # Formatting helpers, constants
├── docker/                    # Dockerfiles, nginx config
├── docker-compose.yml
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- MySQL 8 or MariaDB running locally (or via XAMPP)
- npm

---

### Option A — Local Development

**1. Clone the repository**

```bash
git clone https://github.com/NabiBukhsh-AI/mini-project-board.git
cd mini-project-board
```

**2. Create the database**

Open phpMyAdmin or your MySQL client and create a database:
```sql
CREATE DATABASE mini_project_board;
```

**3. Backend setup**

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below), then:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

API is now running at `http://localhost:4000`

**4. Frontend setup**

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:4000
npm install
npm start
```

Frontend is now running at `http://localhost:3000`

---

### Option B — Docker (Zero Setup)

```bash
# From the project root
docker compose up --build
```

| Service  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3000 |
| API      | http://localhost:4000 |
| MySQL    | localhost:3306        |

The backend automatically runs `prisma migrate deploy` on startup.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable              | Required | Default         | Description                                    |
|-----------------------|----------|-----------------|------------------------------------------------|
| `PORT`                | No       | `4000`          | HTTP server port                               |
| `NODE_ENV`            | No       | `development`   | `development` / `production` / `test`          |
| `DATABASE_URL`        | **Yes**  | —               | MySQL connection string                        |
| `JWT_SECRET`          | **Yes**  | —               | Min 32 chars. Used to sign and verify tokens.  |
| `JWT_EXPIRES_IN`      | No       | `24h`           | Token lifetime                                 |
| `BCRYPT_SALT_ROUNDS`  | No       | `12`            | Password hashing cost factor                   |
| `FRONTEND_URL`        | No       | `http://localhost:3000` | CORS allowed origin                  |

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example `DATABASE_URL`:**
```
mysql://root:@localhost:3306/mini_project_board
```

---

## API Reference

All protected endpoints require:
```
Authorization: Bearer <token>
```

All responses follow this envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth

| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| POST   | `/auth/register`  | No   | Register new user    |
| POST   | `/auth/login`     | No   | Login, receive token |
| GET    | `/auth/me`        | Yes  | Get current user     |

### Projects

| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/projects`       | List all my projects      |
| GET    | `/projects/:id`   | Get a single project      |
| POST   | `/projects`       | Create a project          |
| PATCH  | `/projects/:id`   | Rename / update a project |
| DELETE | `/projects/:id`   | Delete a project          |

### Tasks

| Method | Endpoint                    | Description                   |
|--------|-----------------------------|-------------------------------|
| GET    | `/projects/:id/tasks`       | List tasks (filter + sort)    |
| POST   | `/projects/:id/tasks`       | Create a task                 |
| PATCH  | `/tasks/:id`                | Update a task                 |
| DELETE | `/tasks/:id`                | Delete a task                 |

**Filter and sort examples:**
```
GET /projects/:id/tasks?status=todo
GET /projects/:id/tasks?status=in_progress
GET /projects/:id/tasks?sortBy=dueDate&sortOrder=asc
GET /projects/:id/tasks?sortBy=priority
GET /projects/:id/tasks?status=todo&sortBy=dueDate&sortOrder=asc
```

---

## Assumptions & Tradeoffs

| Decision | Reasoning |
|---|---|
| **Single JWT, no refresh token** | The scope of this assessment does not require session management complexity. A 24h token lifetime is a reasonable tradeoff for simplicity. |
| **Soft deletes on projects and tasks** | Prevents accidental permanent data loss. `deletedAt IS NULL` filters are indexed, keeping query performance intact. |
| **`projectId` sent in task update body** | Ownership must be verified on every mutation. Sending `projectId` in the body keeps the route clean (`/tasks/:id`) while still letting the service enforce the ownership chain without an extra DB lookup via URL params. |
| **Priority sorting done in JavaScript** | MySQL/MariaDB cannot natively sort by enum rank. A raw SQL `CASE` expression works but is fragile across DB versions. At task-board scale, fetching rows and sorting in memory is clean, fast, and maintainable. |
| **Plain CSS over Tailwind** | Zero build configuration, no compiler required, works out of the box with Create React App. Easy to read and modify for any reviewer. |
| **Create React App over Vite** | Maximum compatibility and zero setup friction. No ejecting required, works on all environments without config. |
| **No pagination implemented** | The assessment did not require it. At project-board scale, task lists per project are naturally bounded. The architecture supports adding it trivially — a pagination utility is already designed and can be wired in. |

---

## Future Improvements

Given more time, the following improvements would meaningfully elevate this into a production-grade collaborative tool:

### 🔒 Auth & Security
- **Refresh token rotation** — short-lived access tokens (15m) paired with long-lived refresh tokens stored in the database, rotated on every use to support revocation and prevent token theft
- **Email verification** on registration before granting full access
- **Rate limiting** on auth endpoints to prevent brute-force attacks (`express-rate-limit`)
- **OAuth 2.0 / SSO** — sign in with Google or Microsoft for enterprise use

---

### 🖱️ Drag-and-Drop Kanban
Replace the inline status dropdown with a **Trello-style drag-and-drop board** where tasks can be dragged between the **To Do**, **In Progress**, and **Done** columns. Dragging a card would instantly fire a `PATCH /tasks/:id` to update its status. Libraries such as `@dnd-kit/core` or `react-beautiful-dnd` make this straightforward to implement. This is the most impactful UX improvement for day-to-day usability.

---

### 👥 Team & People Management
- Ability to **create teams** (e.g. Web Dev, Design, QA) and **invite members** by email
- Tasks can be **assigned to a specific person or team**, visible on the task card
- A **"My Tasks" view** showing all tasks assigned to the logged-in user across all projects
- **Role-based access control** within projects — Owner, Admin, Member — controlling who can create, edit, or delete

---

### 🔔 Notifications & Smart Alerting
A full notification layer so team members are always aware of their responsibilities:
- **Email notifications** via SMTP or a service like SendGrid — triggered when a task is assigned to you, when a deadline is approaching, or when a task status changes
- **Push notifications** — browser desktop alerts or mobile push (via Firebase Cloud Messaging) for real-time awareness
- **Deadline reminders** — automated scheduled jobs (using a queue like BullMQ + Redis) that send reminders 48h, 24h, and 1h before a task's due date
- **Smart routing** — automated flows where tasks tagged with a category (e.g. `web-dev`, `design`) are automatically assigned to the corresponding team and only that team is notified, reducing notification noise for everyone else

---

### 💬 Built-in Team Chat
A **per-task group chat** so team members can communicate in context without leaving the board:
- When a task is created and assigned to a team, a dedicated chat thread is opened for that task
- All assigned members are added to the group automatically
- Messages are stored and paginated — full chat history is preserved
- **Context-aware AI assistant** embedded in the chat: if a team member misses part of the conversation, they can ask the AI *"What do I need to do?"* and it will summarise their assigned work, current status, and upcoming deadlines from the project plan. For example:
  > *"Person 1 has completed the Login page. The Signup page assigned to you is still pending. Your deadline is 15 March 2026."*
- Built using WebSockets (Socket.io) for real-time message delivery and live task status updates across all connected clients

---

### 🤖 AI-Powered Project Planning
An intelligent assistant that can **generate an entire project from a document**:
- User uploads a project brief, requirements doc, or a PDF spec
- The AI reads the document and auto-generates: project name, description, task list, suggested priorities, and recommended due dates
- The AI suggests which team or person each task should be assigned to based on the task content and team specialisations
- It also surfaces which features should be shipped first based on dependencies — e.g. *"Authentication must be completed before the Dashboard can be built"*
- Powered by an LLM API with a structured output schema so the results are parsed directly into database records

---

### ⚡ Live Collaboration
- **Real-time updates** via WebSockets — when one user creates or updates a task, all other users viewing the same project board see the change instantly without refreshing
- **Presence indicators** — see who else is currently viewing or editing a project
- **Optimistic UI updates** — UI updates immediately on action, rolls back gracefully if the server rejects

---

### 📊 Analytics & Reporting
- Project-level dashboard showing task completion rate, overdue task count, and velocity over time
- Exportable reports (PDF / CSV) for project status summaries
- Burndown charts to track progress against deadlines

---

### 🏗️ Technical Improvements
- **Integration tests** using Supertest against a dedicated test database — covering full request lifecycle from HTTP to DB
- **Pagination** on task lists — the utility is already scaffolded and just needs to be wired in
- **Structured logging** with Winston or Pino — log levels, request IDs, and JSON output for production log aggregators
- **CI/CD pipeline** — GitHub Actions running lint, tests, and automated deployment on every push to `main`
- **HTTPS / SSL** — Let's Encrypt certificate via Certbot for production deployments
