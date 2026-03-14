# 📋 Mini Project Board

A full-stack project and task management application built for authenticated users to organize their work across projects.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features Completed](#features-completed)
- [Project Structure](#project-structure)
- [Getting Started (Local)](#getting-started-local)
- [Getting Started (Docker)](#getting-started-docker)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Running Tests](#running-tests)
- [Assumptions & Tradeoffs](#assumptions--tradeoffs)
- [Future Improvements](#future-improvements)

---

## Tech Stack

| Layer    | Technology                                  |
|----------|---------------------------------------------|
| Backend  | Node.js, Express.js                         |
| Database | MySQL 8, Prisma ORM                         |
| Auth     | JWT (jsonwebtoken), bcryptjs                |
| Frontend | React 18, React Router v6, Axios            |
| Styling  | Plain CSS (component-scoped)                |
| Testing  | Jest, Supertest                             |
| DevOps   | Docker, docker-compose                      |

---

## Architecture

The backend follows a strict **layered architecture** to separate concerns:

```
Request → Router → Controller → Service → Repository → Prisma → MySQL
```

- **Controllers** — parse HTTP request, call service, send response. No logic.
- **Services** — own all business rules and ownership enforcement.
- **Repositories** — all database access. Services never call Prisma directly.
- **Middleware** — authentication, validation, and error handling are cross-cutting concerns handled in their own layer.
- **Validators** — Zod schemas co-located with their domain. Validated before controllers run.

The frontend uses a **hooks-first** pattern:
- Components consume custom hooks (`useProjects`, `useTasks`)
- Hooks consume service modules
- Service modules contain all Axios calls
- `AuthContext` manages auth state globally via `useReducer`

---

## Features Completed

| Feature | Status |
|---|---|
| User registration & login | ✅ |
| Password hashing with bcrypt | ✅ |
| JWT authentication | ✅ |
| Protected routes (API) | ✅ |
| Protected routes (Frontend) | ✅ |
| Users only access own data | ✅ |
| Create / view / rename / delete projects | ✅ |
| Task count per project | ✅ |
| Create / edit / delete tasks | ✅ |
| Change task status inline | ✅ |
| Filter tasks by status | ✅ |
| Sort tasks by due date | ✅ |
| Sort tasks by priority | ✅ |
| Kanban-style task grouping | ✅ |
| Overdue task highlighting | ✅ |
| Soft deletes (projects & tasks) | ✅ |
| Centralized error handling | ✅ |
| Input validation (Zod) | ✅ |
| Unit tests (Jest) | ✅ |
| Docker + docker-compose | ✅ |

---

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── config/          # env validation, Prisma singleton
│   │   ├── controllers/     # thin HTTP handlers
│   │   ├── services/        # business logic + ownership checks
│   │   ├── repositories/    # all DB access (no Prisma in services)
│   │   ├── middleware/       # authenticate, validate, errorHandler
│   │   ├── routes/          # route definitions with middleware chains
│   │   ├── validators/      # Zod schemas per domain
│   │   └── utils/           # jwt, response helpers
│   ├── prisma/
│   │   └── schema.prisma
│   └── tests/
├── frontend/
│   └── src/
│       ├── pages/           # route-level components
│       ├── components/      # reusable UI components
│       ├── services/        # Axios API wrappers
│       ├── hooks/           # data-fetching hooks
│       ├── context/         # AuthContext
│       └── utils/           # helpers, constants
├── docker/                  # Dockerfiles, nginx config
├── docker-compose.yml
└── README.md
```

---

## Getting Started (Local)

### Prerequisites

- Node.js 18+
- MySQL 8 running locally
- npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd mini-project-board
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev
# API running at http://localhost:4000
```

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env
npm install
npm start
# UI running at http://localhost:3000
```

---

## Getting Started (Docker)

```bash
# From the project root — starts MySQL + API + Frontend
docker compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| API      | http://localhost:4000  |
| MySQL    | localhost:3306         |

> The backend automatically runs `prisma migrate deploy` on startup.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable             | Required | Default       | Description                          |
|----------------------|----------|---------------|--------------------------------------|
| `PORT`               | No       | `4000`        | HTTP server port                     |
| `NODE_ENV`           | No       | `development` | `development` / `production` / `test`|
| `DATABASE_URL`       | **Yes**  | —             | MySQL connection string              |
| `JWT_SECRET`         | **Yes**  | —             | Min 32 chars. Sign & verify JWTs.    |
| `JWT_EXPIRES_IN`     | No       | `24h`         | Token lifetime                       |
| `BCRYPT_SALT_ROUNDS` | No       | `12`          | Password hashing cost factor         |
| `FRONTEND_URL`       | No       | `http://localhost:3000` | CORS origin             |

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## API Reference

All protected endpoints require:
```
Authorization: Bearer <token>
```

All responses follow the envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Auth

| Method | Endpoint         | Auth | Description           |
|--------|------------------|------|-----------------------|
| POST   | `/auth/register` | No   | Register new user     |
| POST   | `/auth/login`    | No   | Login, receive token  |
| GET    | `/auth/me`       | Yes  | Get current user      |

**Register**
```bash
POST /auth/register
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Secret1234"
}
```

**Login**
```bash
POST /auth/login
{ "email": "jane@example.com", "password": "Secret1234" }
# Response: { data: { user, token } }
```

### Projects

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| GET    | `/projects`     | List all my projects         |
| GET    | `/projects/:id` | Get a single project         |
| POST   | `/projects`     | Create a project             |
| PATCH  | `/projects/:id` | Rename / update a project    |
| DELETE | `/projects/:id` | Delete a project (soft)      |

**Create project**
```bash
POST /projects
{ "name": "Website Redesign", "description": "Q3 initiative" }
```

**Rename project**
```bash
PATCH /projects/:id
{ "name": "Website Redesign v2" }
```

### Tasks

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| GET    | `/projects/:id/tasks`        | List tasks (with filter/sort)   |
| POST   | `/projects/:id/tasks`        | Create a task                   |
| PATCH  | `/tasks/:id`                 | Update a task                   |
| DELETE | `/tasks/:id`                 | Delete a task (soft)            |

**Filter and sort tasks**
```bash
# Filter by status
GET /projects/:id/tasks?status=todo
GET /projects/:id/tasks?status=in_progress

# Sort by due date
GET /projects/:id/tasks?sortBy=dueDate&sortOrder=asc

# Sort by priority (high → medium → low)
GET /projects/:id/tasks?sortBy=priority

# Combine filter + sort
GET /projects/:id/tasks?status=todo&sortBy=dueDate&sortOrder=asc
```

**Create task**
```bash
POST /projects/:id/tasks
{
  "title": "Write unit tests",
  "description": "Cover the service layer",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-04-01T00:00:00.000Z"
}
```

**Update task status**
```bash
PATCH /tasks/:id
{ "projectId": "<projectId>", "status": "done" }
```

---

## Running Tests

```bash
cd backend
npm test
```

Tests are unit tests — they mock repositories and external libs so they run with no database required.

```
✓ AuthService › register() › creates a user and returns a token
✓ AuthService › register() › throws ConflictError when email is already registered
✓ AuthService › login() › returns user and token on valid credentials
✓ AuthService › login() › throws UnauthorizedError when email not found
✓ AuthService › login() › throws UnauthorizedError when password is wrong
✓ TaskService › getAll() › returns tasks when user owns the project
✓ TaskService › getAll() › throws 403 when user does not own the project
✓ TaskService › getAll() › throws 404 when project does not exist
✓ TaskService › create() › creates a task in an owned project
✓ TaskService › update() › updates a task that belongs to the owned project
✓ TaskService › remove() › soft-deletes a task
```

---

## Assumptions & Tradeoffs

| Decision | Reasoning |
|---|---|
| **Single JWT (no refresh token)** | The assessment scope doesn't require session management complexity. A 24h expiry is reasonable for this use case. |
| **Soft deletes** | Prevents accidental data loss and keeps an audit trail. deletedAt IS NULL filters are indexed. |
| **projectId in PATCH/DELETE task body** | REST purists prefer `/projects/:pId/tasks/:id` for all operations. Routing to standalone `/tasks/:id` reduces frontend URL complexity while keeping ownership checks in the service layer. |
| **No pagination** | The assessment didn't require it and the task count per project for a board tool is naturally bounded. Pagination utility is scaffolded but not wired. |
| **Plain CSS over Tailwind** | Zero build config, immediately readable, works with CRA without ejecting. |
| **CRA over Vite** | Maximum compatibility with zero setup for the reviewer. |

---

## Future Improvements

Given more time, I would prioritise these improvements:

### High priority
- **Refresh token rotation** — store hashed refresh tokens in the DB; issue short-lived access tokens
- **Integration tests** — use Supertest against an in-memory SQLite or test DB to test the full request lifecycle
- **Pagination** — the utility is already scaffolded in `utils/pagination.js`; wire it into `GET /projects/:id/tasks`

### Medium priority
- **Task comments / activity log** — an `activities` table tracking status changes with timestamps
- **File attachments on tasks** — S3 presigned URL upload pattern
- **Email verification** — nodemailer + a `verified` flag on the User model
- **Rate limiting** — `express-rate-limit` on auth endpoints to prevent brute-force

### Nice to have
- **Drag-and-drop Kanban** — react-beautiful-dnd for status updates via drag
- **Real-time updates** — Socket.io for multi-user project collaboration
- **Notifications** — due-date reminder emails via a background job (Bull queue + Redis)
- **Dark mode** — CSS custom properties already use a design token pattern that supports theming
