# Expense Splitter (Enhanced)

**Phase:** 0 — Product Discovery
**Milestone:** 0.4
**Status:** Draft
**Depends on:** PROBLEM_STATEMENT.md, USER_PERSONAS.md, VISION.md

---

## 1. Project Overview

Expense Splitter is a production-level expense management SaaS application that helps groups — travelers, roommates, and small teams — track shared expenses, split costs fairly using multiple methods, maintain an always-current view of who owes whom, and settle debts using the minimum number of transactions required. It's built as a full-stack MERN application (React/TypeScript frontend, Node/Express/TypeScript backend, MongoDB) with production-grade architecture, not tutorial-level shortcuts.

---

## 2. Elevator Pitch

Expense Splitter is a shared, always-current expense ledger for groups that need more than a notes app but less than accounting software. It replaces manual tracking and end-of-trip mental math with automatic, correct split calculations and a settlement engine that computes the smallest possible set of payments to make everyone even — turning a recurring source of confusion and friction into a solved problem.

---

## 3. Problem We Solve

Groups sharing expenses — whether for a week-long trip, a shared household, or a project — default to notes apps, spreadsheets, or memory to track who paid what. These methods conflate two separate jobs: recording what happened and computing what's fair. Both break down under real conditions: expenses get forgotten, uneven and percentage splits are computed by hand and go stale when edited, and even when balances are known correctly, groups settle debts pairwise instead of computing the minimum number of transactions actually required. The result is confusion, calculation errors, wasted time, and social friction around money.

Expense Splitter's approach is to separate these two jobs cleanly: expenses are recorded as they happen, and balance calculation and settlement are fully automated — never manually recomputed, never stale, and always reflecting the minimum-transaction solution.

---

## 4. Product Vision Summary

The product's direction is toward being a quiet, trusted layer underneath group finances — visible when needed, invisible otherwise. It's guided by a small set of principles: trust first (every balance should be explainable), simplicity over complexity (this is not accounting software), transparency by default (one shared source of truth, not a private ledger), and automation wherever calculation is involved. Version 1 exists to prove a narrow, well-executed core loop — record, split, see balance, settle — rather than attempting to solve every financial problem a group might have.

---

## 5. Target Users

### Traveler
**Problem solved:** Fair, low-friction cost splitting across a short, bounded trip with multiple payers and uneven participation, resolved into a fast, minimal-transaction settlement at the trip's end instead of a stressful manual reconciliation.

### Roommate
**Problem solved:** Continuous visibility into who owes what across recurring monthly expenses (rent, utilities, groceries), preventing small debts from accumulating silently and removing the need for an ongoing, unbounded relationship to have awkward, ad-hoc money conversations.

### Team Collaborator
**Problem solved:** A transparent, attributable record of shared project or team costs — not just a balance, but a traceable history of who spent what and why — that remains valid even as team composition changes over the life of a project.

---

## 6. Core Features

### Version 1 Features
- Secure authentication (register, login, logout, password reset, access/refresh token flow)
- Group creation and membership management
- Expense creation with category and description
- Three split methods: equal, unequal, percentage
- Real-time, always-current balance calculation per member
- Minimum-transaction settlement suggestions
- Expense analytics: category breakdown, monthly trends, per-member contribution

### Future Possibilities
Beyond V1, the product's direction points toward smarter, lower-effort expense entry as usage patterns are understood over time, richer collaborative and recurring-expense handling, and deeper spending insight — without changing the core identity of the product as a lightweight, trustworthy ledger rather than a financial platform.

---

## 7. Technical Highlights

### Complex Business Logic
The centerpiece is a **minimum-transaction settlement algorithm**: given a set of net balances across a group, it computes the smallest possible set of payments that zeroes everyone out, rather than settling debts in the order they were incurred. This matters because it's a genuine algorithmic problem — greedy matching of maximum debtors to maximum creditors — with provable properties around transaction-count minimization, not just CRUD wrapped in a UI.

### Authentication Architecture
Production-grade auth using short-lived access tokens paired with rotated refresh tokens, hashed credentials (bcrypt), and secure cookie handling — designed to resist the common failure modes of naive single-token implementations (no rotation, long-lived tokens, credentials exposed client-side).

### Data Modeling Challenges
The schema has to support expenses that reference a payer and a subset of members (not always the full group), splits computed under three different methods with different validation rules, and historical records that stay valid and attributable even after a group's membership changes — a real design tension between normalization and the practical need to keep historical data intact.

### Production Engineering Practices
End-to-end input validation (Zod, on both client and server), centralized and async-safe error handling, structured logging (Winston/Morgan), a documented testing strategy focused on the highest-risk logic (split calculation, settlement algorithm), and a deployment pipeline with proper environment separation — the practices that distinguish a production system from a tutorial project.

---

## 8. Technology Stack

**Frontend**
| Technology | Purpose |
|---|---|
| React + TypeScript | Type-safe, component-based UI |
| Vite | Fast development/build tooling |
| Tailwind CSS | Utility-first styling, consistent design tokens |
| Redux Toolkit + RTK Query | Global state management and type-safe API data fetching/caching |
| React Router | Client-side routing, protected routes |
| React Hook Form + Zod | Performant, type-safe form handling and validation |
| Framer Motion | Purposeful UI transitions |

**Backend**
| Technology | Purpose |
|---|---|
| Node.js + Express + TypeScript | Type-safe REST API layer |
| Mongoose | Schema modeling and validation over MongoDB |
| JWT (access + refresh) | Stateless, secure authentication |
| bcrypt | Password hashing |
| Zod | Request-level validation matching frontend contracts |

**Database**
| Technology | Purpose |
|---|---|
| MongoDB | Flexible document storage suited to nested, group-scoped expense data |

**Dev Tools**
| Technology | Purpose |
|---|---|
| Winston + Morgan | Structured application and request logging |
| Helmet, CORS, express-rate-limit | Baseline API security hardening |
| Docker | Consistent local development environment |

---

## 9. Portfolio Value

This project demonstrates engineering maturity across the full lifecycle, not just implementation ability: **product thinking**, shown by a documented discovery phase (problem statement, personas, vision) that precedes any code; **system design**, shown by explicit architectural decisions made and justified in writing before implementation; **algorithmic problem solving**, shown by a settlement engine with real complexity and correctness properties, not just a feature checklist; **full-stack development**, shown by a type-safe contract maintained end-to-end from database schema to UI form validation; and **production practices**, shown by security-conscious authentication, structured error handling, and a deliberate testing strategy. Together, these demonstrate the ability to take a product from an ambiguous problem to a maintainable, defensible system — the actual work of a senior engineer, not just the ability to follow a stack.

---

## 10. 60-Second Reviewer Summary

Expense Splitter is a full-stack MERN application that solves a real, well-scoped problem: helping groups — travelers, roommates, small teams — track shared expenses and settle debts fairly with minimal friction. What makes it technically interesting isn't the CRUD surface, it's the settlement engine (a greedy minimum-transaction algorithm with documented complexity), a multi-mode split-calculation service with real validation and precision challenges, and a data model that handles group membership changes without corrupting historical records — all built on a production-grade authentication system and a type-safe contract from database to UI. The project was preceded by genuine product discovery (problem statement, personas, vision) before any architecture or code, reflecting how a real engineering team approaches a new product.
