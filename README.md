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

    npm install

Docker-based local setup and full environment variable documentation are added as Milestone 4.2 completes.

## Project Status

Currently in Phase 4 — Development Execution, Milestone 4.1 (repository foundation).
