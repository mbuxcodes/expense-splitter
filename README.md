# Expense Splitter (Enhanced)

A production-level expense-splitting SaaS application for travelers, roommates, and small teams — built as a full-stack MERN + TypeScript portfolio project.

Groups can record shared expenses, split them fairly (equal, unequal, or percentage), always see a live, accurate balance, and settle up using the minimum number of payments required — computed automatically, in integer cents, with no floating-point rounding risk.

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Redux Toolkit, RTK Query, React Router, React Hook Form, Zod, Recharts
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT (access + rotated refresh tokens)
**Testing:** Vitest, React Testing Library, Supertest, Playwright
**Tooling:** npm workspaces, ESLint, Prettier, Husky + lint-staged, Docker (development), GitHub Actions (CI)

## Documentation

Every product and architecture decision behind this project lives in `docs/`, in the order it was decided:

- **Phase 0 — Product Discovery:** `PROBLEM_STATEMENT.md`, `USER_PERSONAS.md`, `VISION.md`, `PROJECT.md`, `FEATURE_REQUIREMENTS.md`
- **Phase 1 — System Design:** `SYSTEM_ARCHITECTURE.md`, `FRONTEND_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md`, `DATABASE_DESIGN.md`, `API_SPECIFICATION.md`, `SECURITY_ARCHITECTURE.md`
- **Phase 2 — UX Design:** `IA.md`, `USER_FLOWS.md`, `WIREFRAMES.md`, `DESIGN_SYSTEM.md`, `COMPONENT_ARCHITECTURE.md`, `RESPONSIVE_DESIGN.md`, `ACCESSIBILITY_UX.md`, `PRODUCT_DESIGN_REVIEW.md`
- **Phase 3 — Development Planning:** `DEVELOPMENT_STRATEGY.md`

## Getting Started

```powershell
npm install
```

See **Local Development with Docker** below for the full local stack (client, server, MongoDB).

## Development Commands

```powershell
npm run dev          # not yet wired to a running app -- see Milestones 4.3/4.4
npm run lint          # ESLint across both workspaces
npm run typecheck      # TypeScript project-reference typecheck, both workspaces
npm run format:check    # Prettier check (non-mutating)
npm run build             # production build, both workspaces
npm run test                # Vitest, both workspaces
```

## Frontend Development Setup

**Required environment variable** (`client/.env`, copied from `client/.env.example`):

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

**Install:**

```powershell
npm install
```

**Run the dev server:**

```powershell
npm run dev --workspace client
```

Visit `http://localhost:5173/health-check` to confirm the frontend can reach the backend's `/api/v1/health` endpoint end-to-end (the backend must be running separately — see Local Development Setup above).

## Local Development Setup (without Docker)

If Docker isn't practical on your machine, run the client and backend directly against MongoDB Atlas.

**1. MongoDB Atlas setup**
Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), add a database user, and allow your current IP (or `0.0.0.0/0` for local development only — never for production). Copy the connection string.

**2. Environment files**

```powershell
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
```

Edit `server\.env` and set `MONGODB_URI` to your real Atlas connection string, and `JWT_SECRET` to a random string of 32+ characters. Leave `CORS_ORIGIN` as `http://localhost:5173` for local development.

**3. Backend startup** (Terminal 1)

```powershell
npm run dev --workspace server
```

If a required variable is missing or invalid, the server prints exactly which one and exits — it does not start in a broken state. On success, you'll see `MongoDB connected successfully.` followed by `Expense Splitter API listening on port 5000 (development)`.

**4. Frontend startup** (Terminal 2)

```powershell
npm run dev --workspace client
```

**5. Health endpoint testing**

```powershell
curl http://localhost:5000/api/v1/health
curl http://localhost:5000/api/v1/health/database
```

Both should return `{"success":true,"data":{...}}`. The second confirms the live Atlas connection specifically, not just that the server process is running.

### 1. Requirements

- **Node.js 22+** (see `.nvmrc`) — only needed if you want to run scripts outside Docker; the containers bring their own Node runtime.
- **Docker Desktop** (includes the `docker compose` CLI) — [docker.com](https://www.docker.com/products/docker-desktop/).

### 2. Environment setup

Copy each `.env.example` to `.env` and fill in real values (never commit the `.env` files — they're git-ignored):

```powershell
Copy-Item .env.example .env
Copy-Item client\.env.example client\.env
Copy-Item server\.env.example server\.env
```

The root `.env` configures the MongoDB container's credentials; `client/.env` and `server/.env` configure the application itself. See the comments inside each file for what every variable does.

### 3. Starting the application

```powershell
npm run docker:up
```

This builds the images (first run only, or after a dependency change) and starts all three services. Source code is bind-mounted, so edits on your machine trigger hot reload inside the containers — no rebuild needed for day-to-day changes.

### 4. Available services

| Service                  | URL                                                                             |
| ------------------------ | ------------------------------------------------------------------------------- |
| Client (Vite dev server) | http://localhost:5173                                                           |
| Server (Express API)     | http://localhost:5000                                                           |
| MongoDB                  | `localhost:27017` (inside Docker, other containers reach it at `mongodb:27017`) |

### 5. Common commands

```powershell
npm run docker:down    # stop and remove containers (data volume persists)
npm run docker:logs    # follow logs from all services
docker compose up --build   # rebuild images after a dependency change
```

## Git Workflow

`main` (always deployable) <- `develop` (integration) <- `feature/*` (one branch per unit of work). Conventional Commits format (`feat(scope): ...`, `fix(scope): ...`, `chore(scope): ...`, `docs: ...`). See `docs/DEVELOPMENT_STRATEGY.md` Section 8 for the full rationale.

## Project Status

Currently in Phase 4 — Development Execution, Milestone 4.4 (frontend foundation).
