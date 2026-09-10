# Expense Splitter (Enhanced) — Production Roadmap

A senior-mentor view of how we'll take this from idea to a portfolio-grade MERN SaaS product.

---

## How This Roadmap Works

Ten phases, each with a clear entry condition, deliverables, and an exit condition (what "done" means before we move on). We don't code until Phase 4 — everything before that is decisions that are expensive to reverse later (schema shape, auth strategy, split-calculation contracts). Cheap to change on paper, costly to change in code.

For every milestone going forward I will: explain *why* we're making a decision, show the trade-offs we're not taking, ask you to explain it back in your own words before we proceed, and only then implement.

---

## Phase 0 — Product Discovery
**Goal:** Know exactly what we're building and for whom, before any architecture exists.

| Deliverable | Purpose |
|---|---|
| `PROBLEM_STATEMENT.md` | What pain does this solve, and why do existing tools (Splitwise, Settle Up) leave a gap worth building into a portfolio piece? |
| `USER_PERSONAS.md` | 2–3 concrete personas (e.g. "roommate group," "trip group," "recurring household") — split behavior differs by persona and this drives the splitting engine's edge cases |
| `VISION.md` | One-paragraph north star + 3 non-goals (what we're explicitly *not* building, e.g. multi-currency in v1) |
| `PROJECT.md` | Elevator pitch, tech stack summary, and what a reviewer/interviewer sees in 60 seconds |
| `FEATURE_REQUIREMENTS.md` | MVP vs. v2 feature split — this is what stops scope creep from eating the timeline |

**Exit condition:** you can describe, without me, who this is for and what's explicitly out of scope for v1.

**Technical challenges surfaced here:** none yet — this phase is about constraining the problem so later phases have fewer open questions.

**Portfolio value:** interviewers rarely ask "how did you split an array" — they ask "how did you decide what to build." This phase is what gives you an answer.

---

## Phase 1 — System Design
**Goal:** Every major architectural decision made and justified in writing before a line of implementation code exists.

| Deliverable | Purpose |
|---|---|
| `SYSTEM_ARCHITECTURE.md` | High-level diagram: client, API, DB, auth flow, where state lives |
| `FRONTEND_ARCHITECTURE.md` | Feature-based folder contract, state ownership (Redux vs. RTK Query vs. local) |
| `BACKEND_ARCHITECTURE.md` | MVC + service layer boundaries, where business logic vs. request handling lives |
| `DATABASE_DESIGN.md` | Schema, relationships, indexing strategy, embed-vs-reference decisions |
| `API_SPECIFICATION.md` | Every endpoint, request/response shape, status codes, error contract |
| `SECURITY_ARCHITECTURE.md` | Auth token strategy, rate limiting, input validation boundary, threat model |

**Key decisions we'll make together here** (each gets its own WHY discussion):
- Access/refresh token strategy — why not just one long-lived JWT
- Embed `splitAmong` vs. reference a separate collection — this is a real trade-off given how often balances get recalculated
- Where the settlement algorithm runs — request-time vs. precomputed/cached

**Exit condition:** you can explain why we chose service-layer + repository pattern over a fat-controller approach, without notes.

**Technical challenges:** designing a schema that supports the settlement algorithm efficiently without denormalizing so much that writes become error-prone.

---

## Phase 2 — UX Design
**Goal:** Know the shape of every screen and the system's information hierarchy before touching Tailwind.

| Deliverable | Purpose |
|---|---|
| `USER_FLOW.md` | Signup → create group → add expense → view balance → settle up, as explicit flow diagrams |
| `INFORMATION_ARCHITECTURE.md` | Nav structure, route map, what's global vs. group-scoped |
| `DESIGN_SYSTEM.md` | Color, type scale, spacing tokens — the constraints that make the UI feel designed, not defaulted |
| `COMPONENT_LIBRARY.md` | Inventory of reusable components (Button, Card, BalanceRow, SplitEditor, etc.) with variants |

**Exit condition:** you could hand `COMPONENT_LIBRARY.md` + `USER_FLOW.md` to another developer and they'd know what to build without asking you questions.

**Portfolio value:** a `DESIGN_SYSTEM.md` in the repo signals product thinking, not just "I can write CSS."

---

## Phase 3 — Development Plan
**Goal:** Turn architecture into an executable, ordered plan.

| Deliverable | Purpose |
|---|---|
| `FOLDER_STRUCTURE.md` | Finalized frontend + backend tree, locked before Phase 4 starts |
| `CODING_GUIDELINES.md` | Naming conventions, commit message format, TS strictness rules, error-handling conventions |
| `DEVELOPMENT_ROADMAP.md` | Week-by-week build order (this document, expanded into tickets) |
| `TESTING_STRATEGY.md` | What gets unit tests (settlement algorithm, split calculation — non-negotiable) vs. integration vs. skipped for v1 |

**Exit condition:** every subsequent phase becomes "implement what Phase 0–3 already decided," not "figure out what to do."

---

## Phase 4 — Frontend Development
**Goal:** Build the UI shell and feature modules against a mocked/contract-first API.

**Milestones (in order):**
1. Vite + TS + Tailwind v4 scaffold, folder structure from Phase 3, ESLint/Prettier baseline
2. Routing + layouts + protected route wrapper + lazy loading + error boundaries
3. Redux Toolkit store shape + RTK Query API slice (built against `API_SPECIFICATION.md`, before backend exists)
4. Auth feature: login/register forms (React Hook Form + Zod), token handling
5. Groups feature: create/list/detail, member management
6. Expenses feature: add expense with split-type selector (equal/unequal/percentage), Zod schema validation per split type
7. Balances + Settlement UI
8. Analytics dashboard (Recharts): monthly spend, category breakdown, contribution chart
9. Skeleton loading states, toasts, Framer Motion transitions, accessibility pass (focus management, ARIA on forms)

**Technical challenges:** typing RTK Query endpoints so the split-type union (`equal | unequal | percentage`) is exhaustively checked in the form layer, not just at runtime.

---

## Phase 5 — Backend Development
**Goal:** Implement the API against the contract, independent of frontend specifics.

**Milestones (in order):**
1. Express + TS scaffold, config layer (env validation with Zod), Winston + Morgan logging
2. Security middleware stack: helmet, cors, express-rate-limit, cookie-parser
3. Models (Mongoose schemas for User, Group, Expense, Settlement) with indexes from `DATABASE_DESIGN.md`
4. Auth system: register/login/logout, access+refresh token issuance and rotation, bcrypt hashing, forgot/reset password flow, protected middleware, role-based guards
5. Group CRUD + membership logic
6. `services/expenseCalculation.service.ts` — equal, unequal, percentage split logic, with validation (percentages must sum to 100, unequal amounts must sum to total)
7. `utils/settleUpAlgorithm.ts` — minimum transaction settlement (greedy, max-debtor/max-creditor matching)
8. Analytics aggregation endpoints (MongoDB aggregation pipelines)
9. Centralized error handler + async wrapper, consistent error response shape matching `API_SPECIFICATION.md`

**Technical challenges — this is the interview-signal phase:**
- **Settlement algorithm:** greedy approach — repeatedly match the largest debtor with the largest creditor, settle the smaller of the two amounts, repeat. O(n log n) for the sort + O(n) passes ≈ O(n log n) overall for n participants with non-zero net balance; O(n) space for the balance map. We'll walk through why greedy is optimal here (it minimizes transaction *count*, which is a provable property of this matching structure) versus why it does *not* minimize total money moved differently than the naive pairwise approach — same total moved, fewer transactions.
- **Split validation:** preventing floating-point drift when splitting $100 three ways (33.33/33.33/33.34, not 33.33 × 3 = 99.99) — we'll discuss integer-cents storage vs. rounding-remainder-to-last-payer strategies.

---

## Phase 6 — API Integration
**Goal:** Connect real frontend to real backend, replace mocks.

- Swap RTK Query base URL from mock to live API
- Reconcile any drift between `API_SPECIFICATION.md` and what got built (there will be some — document it)
- Real auth flow end-to-end (cookie-based refresh token, in-memory access token)
- Error state handling for real network/validation failures, not just happy path

---

## Phase 7 — Testing
- Unit tests: `expenseCalculation.service.ts`, `settleUpAlgorithm.ts` (highest ROI — pure functions, easy to test exhaustively, and they're the pieces you'll be asked about in interviews)
- Integration tests: auth flow, expense creation → balance recalculation
- Manual QA pass against `USER_FLOW.md`

---

## Phase 8 — Deployment
- Environment separation (dev/staging/prod env vars)
- Backend deploy (Render/Railway-style), MongoDB Atlas, frontend on Vercel/Netlify
- CORS + cookie domain configuration (this is where auth bugs love to hide)
- Basic uptime/error monitoring

---

## Phase 9 — Documentation + Portfolio Presentation
- README with architecture diagram, setup instructions, screenshots/GIF of the settlement flow
- A short "engineering decisions" write-up pulled from Phases 0–1 (this is what makes the repo read as a product, not a tutorial clone)
- Live demo link + seeded demo data so reviewers don't have to sign up to see it work

---

## Indicative Timeline

Paced for learning, not just shipping — adjust to your availability:

| Phase | Focus | Rough Duration |
|---|---|---|
| 0 | Discovery | 2–3 days |
| 1 | System Design | 4–5 days |
| 2 | UX Design | 3–4 days |
| 3 | Dev Plan | 1–2 days |
| 4 | Frontend | 2–3 weeks |
| 5 | Backend | 2–3 weeks |
| 6 | Integration | 3–5 days |
| 7 | Testing | 1 week |
| 8 | Deployment | 3–5 days |
| 9 | Docs/Portfolio | 2–3 days |

---

## Documentation Checklist

**Phase 0:** ☐ PROBLEM_STATEMENT ☐ USER_PERSONAS ☐ VISION ☐ PROJECT ☐ FEATURE_REQUIREMENTS
**Phase 1:** ☐ SYSTEM_ARCHITECTURE ☐ FRONTEND_ARCHITECTURE ☐ BACKEND_ARCHITECTURE ☐ DATABASE_DESIGN ☐ API_SPECIFICATION ☐ SECURITY_ARCHITECTURE
**Phase 2:** ☐ USER_FLOW ☐ INFORMATION_ARCHITECTURE ☐ DESIGN_SYSTEM ☐ COMPONENT_LIBRARY
**Phase 3:** ☐ FOLDER_STRUCTURE ☐ CODING_GUIDELINES ☐ DEVELOPMENT_ROADMAP ☐ TESTING_STRATEGY

---

## Learning Outcomes (by the end)

You should be able to explain, unaided: JWT access/refresh rotation and why it beats a single long-lived token; service-layer vs. fat-controller trade-offs; why greedy settlement minimizes transaction count and its complexity; embed-vs-reference schema decisions and their write/read trade-offs; and how to defend every folder-structure decision in an interview.

## Portfolio Value

What makes this *not* look like a tutorial clone: the `PROBLEM_STATEMENT.md`/`VISION.md` pair (shows product thinking), the settlement algorithm with a documented complexity analysis (shows CS fundamentals), and a security architecture doc that predates the code (shows you design before you build).

---

# Starting Point: Phase 0, Milestone 1

Before I draft `PROBLEM_STATEMENT.md`, answer this so it's grounded in your actual reasoning rather than me inventing a generic SaaS pitch:

**What's the specific gap you see in existing tools like Splitwise that this project addresses — or is the primary goal here portfolio depth rather than a genuine product gap?** Either answer is fine, but it changes what `VISION.md` and `FEATURE_REQUIREMENTS.md` should prioritize (e.g., a "recurring household" persona pushes toward recurring-expense scheduling as a headline feature; a pure portfolio focus pushes toward maximizing algorithmic/architectural surface area instead).
