# Development Strategy — Expense Splitter (Enhanced)

**Phase:** 3 — Development Plan
**Milestone:** 3.1
**Status:** Draft
**Depends on:** All Phase 0, Phase 1, and Phase 2 documents (frozen)

---

## 1. Development Philosophy

**Development principles:** every implementation decision is evaluated against one question first — does this match what the frozen architecture already decided, or does it introduce a new decision? New decisions are rare and must be justified against a real production risk, not convenience; matching decisions are implemented directly, without re-litigating them.

**Quality over speed:** for this project, "speed" that produces code inconsistent with `BACKEND_ARCHITECTURE.md`'s layering or `SECURITY_ARCHITECTURE.md`'s trust boundaries isn't actually faster — it produces rework once the inconsistency is discovered (most dangerously, in the split/balance calculation logic, where a shortcut could silently produce wrong financial output). Quality here specifically means: business logic isolated in services, financial calculations in integer cents from the first line of code, and authorization checks present before a feature is considered functional, not added afterward.

**Incremental delivery:** each development phase (Section 3) produces a demonstrable, working slice of the core loop — not a fully-built frontend waiting on a fully-built backend. This is directly why Section 2 selects vertical-slice development over layer-based development.

**Production-first mindset:** error handling, validation, and authorization are built alongside a feature's happy path, not bolted on afterward — `BACKEND_ARCHITECTURE.md` Section 14's error classes and `SECURITY_ARCHITECTURE.md`'s authorization model are used from the first endpoint implemented, not retrofitted once "the feature works."

**Avoiding premature optimization:** consistent with `SYSTEM_ARCHITECTURE.md` Section 9 and `BACKEND_ARCHITECTURE.md` Section 20 — no caching layer, no background job processing, and no query optimization beyond the indexes already specified in `DATABASE_DESIGN.md` Section 13 are introduced during initial development. If a genuine performance problem is observed (not anticipated), it's addressed then, against real data.

**Maintaining architecture consistency:** every phase in Section 3 ends with a check against the specific frozen document(s) it implements — this isn't a one-time review at the end of the project, it's a per-phase habit.

**How development decisions are evaluated:** three questions, in order — (1) Does a frozen document already answer this? Use that answer. (2) If not, does the decision affect financial correctness or security? If so, it gets explicit reasoning before implementation, not an inline judgment call. (3) Otherwise, implement the simplest option consistent with the existing architecture and move on — this project explicitly avoids over-engineering low-stakes decisions (`VISION.md`'s Simplicity Over Complexity principle, applied here to the development process itself).

---

## 2. Development Approach

**Comparing the three models:**
- **Layer-based development** (build the entire backend, then the entire frontend, or vice versa) — rejected. It delays any end-to-end demonstration of the core loop until nearly the end of the project, and it means the split-calculation engine (the highest-risk logic) wouldn't be exercised against a real UI until very late, delaying discovery of any contract mismatch between frontend and backend assumptions.
- **Feature-based development** (build one entire feature's frontend and backend together, e.g., "all of Groups," then "all of Expenses") — closer, but still risks building UI for a feature before its harder backend logic is proven, or vice versa, within that feature.
- **Vertical slice development** (build one thin, complete path through every layer for a single capability, then widen) — **selected.** Each slice moves through `Frontend UI → API integration → Backend logic → Database → Tests → Documentation`, per the sequence given in this milestone's brief.

**Why vertical slices fit this project specifically:** the core loop (`FEATURE_REQUIREMENTS.md` Section 1) is itself a sequence of dependent slices — a group must exist before an expense can be created, an expense must exist before a balance can be calculated. Building vertically means each slice is fully demonstrable and testable the moment it's done, and — critically for the split/balance/settlement logic specifically — the riskiest calculations get built and tested early, against a real (if minimal) UI and real data, rather than being the last thing integrated.

**Example applied to this project:** "Create Expense" as a slice means: the `ExpenseForm` component exists, it calls the real `POST /expenses` endpoint, that endpoint calls the real `expenseCalculation.service.ts`, the result is actually persisted via the real repository, unit tests cover the split engine, and this document's own Definition of Done (Section 13) is met — all before starting the next slice ("Calculate Balance"). The frontend is never "ahead of" the backend by more than one slice, avoiding the mock-data drift that `FRONTEND_ARCHITECTURE.md` Section 6 already warns about at the API-layer level.

---

## 3. Development Phases

### Phase A — Project Foundation
- **Goal:** a working, empty, deployable skeleton — no features yet.
- **Includes:** repo structure per `FRONTEND_ARCHITECTURE.md` Section 3 and `BACKEND_ARCHITECTURE.md` Section 3, Vite/Express boilerplate, environment config validation (Section 9 below), Winston/Morgan wired, Helmet/CORS/rate-limit middleware in place, base RTK Query `baseApi.ts` configured, empty `app/router.tsx` with public/protected route shells, a Docker Compose development environment (restoring the local-environment standard already committed to in Phase 0's technology context, distinct from the production Railway/Render deployment target), a CI pipeline (lint + unit tests run on every pull request, per Section 8's git workflow), and `/api/docs` scaffolded (per `API_SPECIFICATION.md` Section 12, populated incrementally as endpoints are built in later phases rather than left for a late-stage task).
- **Backend work:** `config/` (env validation), base Express app with the middleware chain from `BACKEND_ARCHITECTURE.md` Section 7, global error handler (Section 14) wired but with nothing to catch yet.
- **Frontend work:** app shell, routing skeleton, Redux store configured, design tokens (`DESIGN_SYSTEM.md`) wired into Tailwind config.
- **Database impact:** Atlas connection established; no collections yet.
- **Testing requirements:** a smoke test confirming the server boots and responds to `/health` (Section 13 of `API_SPECIFICATION.md`'s upgraded contract); CI configured to run this and all subsequent unit tests automatically.
- **Completion criteria:** `/health` returns `200` locally, in Docker, and in a deployed environment; frontend renders an empty shell against a live (empty) backend; a CI run passes on the initial commit.

### Phase B — Authentication System
- **Goal:** the full auth lifecycle, end to end.
- **Includes:** register, login, logout, refresh (with rotation + reuse detection), forgot/reset password — all endpoints from `API_SPECIFICATION.md` Section 14, all security behaviors from `SECURITY_ARCHITECTURE.md` Section 2.
- **Backend work:** `User` model, `refreshTokens`/`passwordResetTokens` collections, auth service + repository, auth middleware.
- **Frontend work:** `features/auth/` — Login/Register forms, `useAuth` hook, protected-route wrapper, silent session restoration (`FRONTEND_ARCHITECTURE.md` Section 7), single-flight refresh handling.
- **Database impact:** `users`, `refreshTokens`, `passwordResetTokens` collections created with their indexes (`DATABASE_DESIGN.md` Section 13).
- **Testing requirements:** unit tests for token rotation/reuse detection logic; integration tests for the full register→login→refresh→logout cycle.
- **Completion criteria:** a user can register, log in, stay logged in across a page refresh, and log out — matching this document's Definition of Done (Section 13) in full, not just "the form submits."

### Phase C — User Profile
- **Goal:** the smallest possible vertical slice, used to validate the pattern established in Phases A/B before tackling group-scoped complexity.
- **Includes:** `GET/PATCH /users/me`.
- **Backend/Frontend/Database:** minimal — no new collections, `Profile` page and form.
- **Testing:** integration test for profile update; component test for the form.
- **Completion criteria:** a logged-in user can view and edit their name/avatar.

### Phase D — Group Management
- **Goal:** groups and membership, including the soft-removal model.
- **Includes:** create/view/update group, add/remove member — `API_SPECIFICATION.md` Sections 16–17.
- **Backend work:** `Group` model (with embedded `members`), group + membership services enforcing active-membership authorization (`SECURITY_ARCHITECTURE.md` Section 4) from this point forward — every subsequent phase's endpoints depend on this check existing and being correct.
- **Frontend work:** `features/groups/` — Dashboard (group list), Group Detail shell, `MemberList`.
- **Database impact:** `groups` collection + its indexes.
- **Testing requirements:** authorization tests are the priority here — verifying a non-member is rejected, and a soft-removed member loses access on their very next request (`SECURITY_ARCHITECTURE.md` Section 13's integration-test requirement), since every later phase relies on this being correct.
- **Completion criteria:** a user can create a group, add/remove members, and the removed-member access check is verified, not assumed.

### Phase E — Expense Management
- **Goal:** expense CRUD, with only the `equal` split method functionally active — but the `SplitSelector` component is built as its full, already-planned three-mode structure (`COMPONENT_ARCHITECTURE.md` Section 3) from this phase, with `unequal`/`percentage` modes present but inert. This avoids building `ExpenseForm` against equal-split logic only and then structurally reworking it in Phase F — Phase F activates the remaining modes within the existing structure, it doesn't rebuild it.
- **Includes:** `POST/GET/PUT/DELETE /groups/:groupId/expenses`.
- **Backend/Frontend/Database:** `Expense` model, `ExpenseForm` with the full `SplitSelector` shell (equal mode wired, others present but disabled), cursor pagination (`API_SPECIFICATION.md` Section 4) implemented here since it's needed for the expense list from the start.
- **Testing:** integration tests for the full CRUD cycle and pagination behavior.
- **Completion criteria:** a user can create, view, edit, and delete an equal-split expense within a group they're a member of; `SplitSelector`'s structure is in place and ready for Phase F to activate, not rebuild.

### Phase F — Split Engine
- **Goal:** full split-method support (unequal, percentage), isolated and exhaustively tested — the highest-financial-risk phase in the project.
- **Includes:** `expenseCalculation.service.ts` complete implementation (`BACKEND_ARCHITECTURE.md` Section 10), `SplitSelector` component's unequal/percentage sub-forms.
- **Testing requirements:** this phase is testing-first, not testing-after — the largest-remainder rounding logic, sum-validation rules, and edge cases (single participant, non-evenly-divisible totals) are unit-tested exhaustively before the corresponding UI is considered done.
- **Completion criteria:** all three split methods produce cent-exact results, verified by tests, not manual spot-checking.

### Phase G — Balance Calculation
- **Goal:** live balance aggregation.
- **Includes:** `GET /groups/:groupId/balances`, `balanceCalculation.service.ts` (`BACKEND_ARCHITECTURE.md` Section 11).
- **Backend work:** the aggregation pipeline (`DATABASE_DESIGN.md` Section 18) — tested against fixture data with hand-computed expected results, per that document's Section 24 testing requirement.
- **Frontend work:** Balances tab, `BalanceCard` with its three explicit variants (`COMPONENT_ARCHITECTURE.md` Section 3).
- **Completion criteria:** balances update correctly and immediately after any expense create/edit/delete from Phases E/F, verified via test, not visual inspection alone.

### Phase H — Settlement System
- **Goal:** the product's core differentiator.
- **Includes:** `GET /groups/:groupId/settlement`, `POST/GET /groups/:groupId/settlements` — `settleUpAlgorithm.ts`.
- **Testing requirements:** the greedy algorithm is unit-tested across varied balance distributions (`BACKEND_ARCHITECTURE.md` Section 19) before the Settlement tab UI is built against it.
- **Frontend work:** Settlement tab, `SettlementCard`, the confirmation-dialog flow for "Mark as Paid" (`ACCESSIBILITY_UX.md` Section 2).
- **Completion criteria:** settlement suggestions are correct and minimal for a range of test scenarios, and recording a settlement correctly updates subsequent balance calculations.

### Phase I — Analytics
- **Goal:** the three analytics aggregations, built last among features since they're read-only and depend on the expense data the earlier phases already produce.
- **Includes:** category/trend/contribution endpoints and `ChartCard`-based Analytics tab.
- **Completion criteria:** all three charts render correctly against real (test) data, including their independent loading/empty states (`WIREFRAMES.md`).

### Phase J — Testing & Optimization
- **Goal:** fill any coverage gaps left by the per-phase testing already done throughout (Sections 3's phases are testing-inclusive, not testing-deferred — this phase is a final pass, not where testing "starts"), plus the three E2E flows (`BACKEND_ARCHITECTURE.md` Section 19 / `FRONTEND_ARCHITECTURE.md` Section 15), plus a pass on performance against the indexes already specified (verifying `explain()` output per `DATABASE_DESIGN.md` Section 24, not adding new optimization).
- **Completion criteria:** the three priority E2E flows (auth lifecycle, expense creation → balance update, settlement flow) pass; no known gap remains in split/balance/settlement algorithm test coverage.

---

## 4. Feature Development Order

Directly follows the core loop (`FEATURE_REQUIREMENTS.md` Section 1) and the phase sequence above:

**P0 (Critical MVP — Phases A–H):** Foundation → Authentication → Group Management → Expense Management → Split Engine → Balance Calculation → Settlement System. Nothing in P0 is optional; the product has no value without all seven.

**P1 (Important improvements — Phase I and profile polish):** Analytics, full Profile (avatar), pagination UX polish. Valuable but the core loop is complete and demonstrable without them.

**P2 (Future enhancements, not built in this development cycle):** recurring expenses, multi-currency, notifications, payment integration, media upload implementation (`API_SPECIFICATION.md` Section 22's documented-but-not-built direction) — consistent with `FEATURE_REQUIREMENTS.md` Section 4's V2+ scope.

Phase C (User Profile) is sequenced early despite being P1-adjacent specifically because it's the smallest possible slice to validate the vertical-slice pattern (Section 2) before Phase D's higher complexity — a development-sequencing choice, not a reflection of its product priority.

---

## 5. Frontend Development Strategy

**Component implementation order:** Foundation components (`Button`, `Input`, `Select`, `Modal`, `Toast` — `COMPONENT_ARCHITECTURE.md` Section 1) are built first, during Phase A, since every later feature depends on them; Layout components (Section 2) follow immediately, during Phase A/B; Feature components are built per-phase, alongside their corresponding backend slice (Section 2's vertical-slice principle) — never built ahead of the API they consume.

**Feature folder development order:** `auth/` → `groups/` → `expenses/` → `settlements/` → `analytics/`, matching Section 3's phase order exactly — no feature folder is started before its dependencies (e.g., `expenses/` depends on `groups/` existing) are functional.

**State management strategy:** exactly as specified in `FRONTEND_ARCHITECTURE.md` Section 5 — RTK Query endpoints are added per-slice (an `expensesApi.ts` endpoint is added when Phase E is built, not scaffolded speculatively ahead of time), Redux slices are added only for the specific client-state needs identified in that document (auth identity, UI preferences).

**API integration strategy:** each vertical slice's frontend work begins only once its backend endpoint is functional (even if minimally) — never against a hand-written mock that could drift from the real contract, consistent with `FRONTEND_ARCHITECTURE.md` Section 6's single-base-API approach.

**Form implementation strategy:** React Hook Form + Zod per `FRONTEND_ARCHITECTURE.md` Section 10, schemas written alongside their corresponding backend Zod validators in the same phase (Phase F's split-method schemas are written together with the frontend and backend validation, since they must agree on the integer-cents/basis-points contract established in that document's Section 10).

**Error handling approach:** the global error-normalization layer (`FRONTEND_ARCHITECTURE.md` Section 6) and Error Boundary (Section 13) are built in Phase A, before any feature exists to generate errors — so every subsequent phase's error states are handled by an already-working system, not a parallel one built per-feature.

**Loading state implementation:** the skeleton/button-spinner/background-refetch patterns (`FRONTEND_ARCHITECTURE.md` Section 14) are established as reusable patterns via the Foundation components in Phase A, then applied consistently per-feature — not reinvented per screen.

**Responsive implementation approach:** every feature is built mobile-first from its first implementation (per `RESPONSIVE_DESIGN.md`'s base-styles-first principle) — responsive behavior is not a separate later pass; a component isn't considered done at mobile width only, per the Definition of Done (Section 13).

---

## 6. Backend Development Strategy

**Backend module implementation order:** matches Section 3's phases exactly — `config`/middleware (Phase A) → `auth` module (Phase B) → `users` (Phase C) → `groups` (Phase D) → `expenses` + `expenseCalculation.service.ts` (Phases E/F) → `balanceCalculation.service.ts` (Phase G) → `settleUpAlgorithm.ts` (Phase H) → analytics aggregations (Phase I).

**Controller/service/repository development approach:** for each module, built in this order — repository (data access, tested against a real test-database instance) → service (business logic, unit-tested in isolation against a mocked repository) → controller (thin translation layer, integration-tested end-to-end) — building bottom-up within each vertical slice means each layer is independently verified before the next depends on it.

**Validation strategy:** Zod schemas are written before the controller that uses them, directly from the shapes already defined in `API_SPECIFICATION.md`'s per-endpoint request schemas — this document doesn't re-derive validation rules, it implements the ones already specified.

**Error handling strategy:** the custom error classes and global error middleware (`BACKEND_ARCHITECTURE.md` Section 14) are built in Phase A, before any service exists to throw them — every subsequent service throws typed errors (`ValidationError`, `AuthorizationError`, etc.) from its first implementation, never a bare `Error` or inline response, per that document's stated rule.

**Authentication implementation order:** register → login → access-token verification middleware → refresh (with rotation) → reuse detection → logout → password reset, in that order within Phase B — each step is independently testable before the next is built (e.g., login is fully working and tested before refresh logic is attempted), rather than building the whole auth system as one unit.

**Business logic isolation strategy — where split calculation logic lives:**
```
Controller  ❌  (never — a controller must not contain calculation logic, per BACKEND_ARCHITECTURE.md Section 4)
Service     ✅  (expenseCalculation.service.ts — the only correct location)
```
This is not a stylistic preference — it's the specific architectural decision (`BACKEND_ARCHITECTURE.md` ADR-002) that makes the split engine unit-testable in isolation (Phase F's testing-first requirement, Section 3 above, depends on this placement) and reusable identically between expense creation and expense editing (`BACKEND_ARCHITECTURE.md` Section 9's full-recalculation-on-edit rule) without duplicating the calculation in two controllers.

---

## 7. Database Implementation Strategy

**Development order** (matches dependency order, not the order listed in the milestone brief's example — `Members` are not a separate collection, per the locked soft-removal architecture, so this is stated correctly here):
```
Users
  ↓
Groups (with embedded members subdocuments)
  ↓
Expenses (with embedded splitAmong)
  ↓
Settlements
  ↓
(refreshTokens / passwordResetTokens are created alongside Users, in Phase B, not sequenced separately)
```

**Schema dependencies:** `Expense.group`/`payer`/`splitAmong.user` reference `Group`/`User`, so those collections' schemas must exist first; `Settlement.from`/`to`/`group` similarly depend on `User`/`Group` existing — this is a hard ordering constraint, not a preference.

**Migration strategy:** per `DATABASE_DESIGN.md` Section 21 — no migration framework is introduced; schema additions during development (which are expected and normal, not a sign of a design flaw) are additive/non-breaking by Mongoose's nature, and any genuinely breaking change during development itself (pre-production, no real user data yet) is handled by simply dropping and recreating the local/test database rather than writing a migration script — migration scripts, per that document, are reserved for post-launch schema changes against real data, which doesn't apply during initial development.

**Index creation timing:** every index specified in `DATABASE_DESIGN.md` Section 13 is created in the same phase as the collection it belongs to (e.g., `expenses.group` index is created alongside the `Expense` model in Phase E) — never deferred to a later "performance pass," consistent with Section 1's avoiding-premature-optimization principle applied in reverse: these aren't premature, they're already-specified, query-pattern-driven indexes, so creating them alongside their collection is simply implementing the existing design, not optimizing speculatively.

**Data integrity validation:** Mongoose schema-level validators (required fields, integer-cents constraints, Section 15 of `DATABASE_DESIGN.md`) are written in the same phase as the schema itself — never added retroactively after a bug is found, since that would mean a phase was marked complete without its full specified validation in place, violating this document's Definition of Done (Section 13).

---

## 8. Git Workflow Strategy

**Branch strategy:** `main` (always deployable, represents the current production state), `develop` (integration branch for in-progress work), `feature/*` (one branch per vertical slice — e.g., `feature/expense-split-engine`, matching Section 3's phases rather than smaller arbitrary units, since a phase is already the right-sized unit of complete, demonstrable work).

**Commit strategy:** Conventional Commits format (`type(scope): description`) — `feat(auth): implement JWT authentication flow`, `fix(balance): correct settlement calculation`, `test(split): add remainder-distribution edge cases`, `docs(api): update error code registry`. This isn't ceremony — a consistent format makes the commit history itself a readable changelog, valuable specifically for a portfolio project a reviewer might actually read through.

**When to commit:** at each logically complete unit within a slice (e.g., "repository layer for expenses" is its own commit, separate from "service layer for expenses") — small enough that a commit is independently reviewable, large enough that it represents real, working progress (never a commit that leaves the build broken).

**When to merge:** a `feature/*` branch merges into `develop` only when its phase's full Definition of Done (Section 13) is met and CI passes (lint + unit tests, established in Phase A) — not when "the code works," but when tests, error handling, responsive behavior, documentation updates, and an automated CI run are all green. `develop` merges into `main` at natural phase boundaries (Section 3), representing a genuinely demonstrable increment.

**Pull request expectations:** even as a solo developer, PRs are used (self-reviewed) as a deliberate checkpoint — the PR description restates the phase's completion criteria (Section 3) as a checklist, which doubles as a forcing function against skipping the Definition of Done, and as a readable record for a future portfolio reviewer of how the project actually progressed.

**Documentation updates:** any change to an endpoint's behavior updates `API_SPECIFICATION.md` (Contract Rules, Section 3 of that document, already establishes that documentation drift is treated as a bug) in the same PR as the code change — never a follow-up task.

---

## 9. Environment Strategy

**Environments:** development (local, `.env` file, git-ignored), testing (CI/local test runs, a separate test-only MongoDB database — never the development or production database), production (hosting-platform-injected environment variables, per `BACKEND_ARCHITECTURE.md` Section 21).

**Environment variables:**

*Frontend* (`import.meta.env`, per `FRONTEND_ARCHITECTURE.md` Section 19):
- `VITE_API_BASE_URL` — the backend API's base URL, differing per environment.
- Auth configuration is otherwise not environment-variable-driven on the frontend (no client-side secrets exist to configure — the access token is runtime state, not a build-time value).

*Backend* (`BACKEND_ARCHITECTURE.md` Section 16, Section 21):
- `MONGODB_URI` — Atlas connection string, differing per environment (dev/test/production databases are always distinct).
- `JWT_SECRET` — signing secret (`SECURITY_ARCHITECTURE.md` Section 2).
- `REFRESH_TOKEN_COOKIE_SECRET` (if a separate cookie-signing secret is used, distinct from the JWT secret, as a defense-in-depth measure).
- `CORS_ORIGIN` — the allowed frontend origin, differing per environment.
- `CLOUDINARY_*` (cloud name, API key, API secret) — **reserved for the future Media Upload implementation** (`API_SPECIFICATION.md` Section 22) — not consumed by any V1 code path; included in `.env.example` now as a placeholder so the future integration point is visible, consistent with that document's "documented for future compatibility" framing, not because V1 implements uploads.
- `EMAIL_SERVICE_*` (provider API key/credentials) — required for the forgot-password email delivery mechanism, which `BACKEND_ARCHITECTURE.md` Section 5 explicitly deferred as "out of this architecture document's scope" but which does need a real provider chosen and configured during Phase B implementation, since the password-reset flow is non-functional without it.

**Security rules:**
- **Never commit secrets** — enforced via `.gitignore` covering all `.env*` files except `.env.example`.
- **Use `.env.example`** — every variable above is listed with a placeholder/description, never a real value, committed to the repo so environment setup is self-documenting for a future contributor (or future you).
- **Validate required environment variables** — per `BACKEND_ARCHITECTURE.md` Section 16, a Zod-validated config schema checks every required variable is present and minimally well-formed at server startup, failing fast rather than allowing a misconfigured server to start.

---

## 10. Testing Strategy Alignment

Directly implements `BACKEND_ARCHITECTURE.md` Section 19 and `FRONTEND_ARCHITECTURE.md` Section 15's already-specified strategies, sequenced against the development phases in Section 3:

**Unit testing** (built alongside each phase, not deferred): utility functions (Phase A/ongoing), the split calculation algorithm (Phase F — exhaustive, testing-first per Section 3), the settlement algorithm (Phase H — exhaustive, testing-first), balance calculation (Phase G — against fixture data).

**Integration testing:** API endpoints and the full authentication flow (Phase B), authorization/membership checks (Phase D — priority, since every later phase depends on it being correct; also the phase to apply the last-active-member-removal confirmation copy carried forward from the Phase 2 Final Design Review), expense CRUD (Phase E). Backend integration tests use Supertest against the real Express app (in-process, no separate server needed) alongside Vitest as the test runner — Supertest is the standard, expected complement to Vitest for exercising Express endpoints directly, distinct from the browser-level Playwright E2E tests below.

**Frontend testing:** components and forms tested as they're built per-phase (e.g., `SplitSelector`'s three modes tested in Phase F, alongside the backend split engine they must agree with) — not as a separate later pass.

**E2E testing:** the three priority flows (`FRONTEND_ARCHITECTURE.md` Section 15 / `BACKEND_ARCHITECTURE.md` Section 19) — authentication, expense creation through balance update, and settlement — are each written once their full vertical slice (Phases B, E–G, H respectively) is complete, and are the specific focus of Phase J.

**Prioritization around financial correctness:** restated as the organizing principle of this entire section — split calculation and settlement algorithm tests are the only tests in this project explicitly required to exist *before* their corresponding UI is considered built (Section 3, Phases F and H), reflecting that a UI bug is inconvenient but a financial calculation bug undermines the product's entire reason to exist (`PROBLEM_STATEMENT.md` Section 1).

---

## 11. Development Milestone Definition

A phase (Section 3) is not "complete" when its UI renders and appears to work. Every milestone requires all of the following, matching the Definition of Done (Section 13) applied per-phase rather than only at project end:

- **Feature implementation** — the full vertical slice, frontend through database, per Section 2.
- **Error handling** — every failure mode identified for that feature (`API_SPECIFICATION.md`'s per-endpoint error list) is handled, not just the happy path.
- **Loading states** — the appropriate granular pattern (`FRONTEND_ARCHITECTURE.md` Section 14) is implemented, not a placeholder spinner.
- **Responsive behavior** — verified at mobile, tablet, and desktop breakpoints (`RESPONSIVE_DESIGN.md`), not desktop-only with mobile "to be added later."
- **Accessibility verification** — the relevant checklist items from `ACCESSIBILITY_UX.md` Section 3 are checked for that feature's specific components, not deferred to a final accessibility pass.
- **Tests** — per Section 10 above, appropriate to that feature's risk level.
- **Documentation update** — any deviation from or clarification of the frozen architecture documents discovered during implementation is reflected back into those documents in the same phase, not left as tribal knowledge.

"A feature is NOT complete when UI works only" — restated as this document's single most important development-process rule, since it's the rule most likely to be silently skipped under time pressure.

---

## 12. Technical Risks During Development

| Risk | Impact | Prevention Strategy |
|---|---|---|
| Incorrect balance calculation | Critical — undermines the product's entire value proposition | Exhaustive unit testing of `expenseCalculation.service.ts` and `balanceCalculation.service.ts` against hand-computed fixtures (Phases F/G), built and tested before dependent UI (Section 3) |
| Data consistency issues (e.g., a split not summing to its expense total slipping through) | Critical | Defense-in-depth validation already specified in `DATABASE_DESIGN.md` Section 14 (Zod + service + schema layers) implemented in full at each phase, not partially |
| Authentication bugs (token handling, refresh race conditions) | High — could lock out users or, worse, fail to enforce access control | Phase B's step-by-step, independently-tested build order (Section 6); the single-flight refresh pattern (`FRONTEND_ARCHITECTURE.md` ADR-006) implemented exactly as specified, not simplified under time pressure |
| State synchronization problems (frontend showing stale balances/expenses) | Medium-High — directly undermines the "always-current" product promise | RTK Query cache-tag invalidation matrix (flagged as a pre-Phase-6 requirement in the earlier frontend review) finalized concretely during Phase E, not left implicit |
| Performance issues (slow balance/analytics aggregation as data grows) | Medium | Indexes created alongside their collections (Section 7) per the already-specified, query-pattern-driven index strategy — no speculative work needed, but no skipping the specified indexes either |
| Complex split validation edge cases (single participant, non-divisible totals, zero-amount edge cases) | High (financial correctness) | Phase F's testing-first requirement explicitly includes these named edge cases, not just the common case |
| Third-party email delivery service unavailability or misconfiguration (password reset) | Medium | The forgot-password endpoint's uniform-response behavior (`API_SPECIFICATION.md` Section 14) means delivery failures can't be signaled to the user directly without reintroducing account-enumeration risk — failures are caught and logged server-side as a distinct security event (`SECURITY_ARCHITECTURE.md` Section 11) instead |
| Scope creep during implementation (discovering a "nice to have" mid-phase) | Medium — threatens the project's ability to finish as a coherent V1 | Section 1's decision-evaluation framework — any new idea is checked against whether a frozen document already excludes it (`FEATURE_REQUIREMENTS.md` Section 5) before any implementation time is spent |

---

## 13. Definition of Done

A feature is complete only when every item below is true — this checklist is used per-phase (Section 3), not only at final project delivery:

**Frontend**
- [ ] UI implemented per `WIREFRAMES.md` and `COMPONENT_ARCHITECTURE.md`
- [ ] Responsive at all breakpoints (`RESPONSIVE_DESIGN.md`)
- [ ] Accessible per the relevant `ACCESSIBILITY_UX.md` checklist items
- [ ] Loading states implemented per `FRONTEND_ARCHITECTURE.md` Section 14's granular pattern
- [ ] Error states implemented per `FRONTEND_ARCHITECTURE.md` Section 13

**Backend**
- [ ] API complete and matching `API_SPECIFICATION.md` exactly (including error codes from the Error Code Registry)
- [ ] Validation added at every layer (Zod, service, schema) per `DATABASE_DESIGN.md` Section 14
- [ ] Security checked — authentication, authorization, and rate limiting (where applicable) verified per `SECURITY_ARCHITECTURE.md`

**Database**
- [ ] Schema updated and matching `DATABASE_DESIGN.md`
- [ ] Indexes created per the specified index strategy

**Quality**
- [ ] Tests added, appropriate to the feature's risk level (Section 10)
- [ ] Documentation updated — any deviation reflected back into the relevant frozen document

---

## 14. Architecture Consistency Review

- **Conflicts with `FRONTEND_ARCHITECTURE.md`?** None. This document's frontend strategy (Section 5) implements that document's component order, state management, and error/loading patterns directly, without modification.
- **Conflicts with `BACKEND_ARCHITECTURE.md`?** None. The layered build order (Section 6) and business-logic-isolation answer (split calculation lives in the service layer) are direct restatements of that document's ADR-002 and Section 4.
- **Conflicts with `API_SPECIFICATION.md`?** None. Validation, error codes, and pagination (Sections 6, 10, 13) are implemented exactly as that document specifies — no new endpoint behavior is introduced here.
- **Conflicts with `SECURITY_ARCHITECTURE.md`?** None. Phase B's authentication build order and Phase D's authorization-testing priority directly implement that document's Sections 2 and 4–5.
- **Conflicts with `DESIGN_SYSTEM.md`?** None. Section 5's responsive-from-first-implementation and Foundation-components-first ordering are consistent with that document's token structure and `COMPONENT_ARCHITECTURE.md`'s reuse model.

**New decisions introduced by this document, flagged for visibility (non-blocking):**
- Choice of git branch/commit convention (Section 8) — process-level, doesn't affect the product architecture.
- Sequencing "equal-split-only" expenses in Phase E before full split support in Phase F — a development-sequencing choice, not a scope change (`FEATURE_REQUIREMENTS.md` still requires all three methods for V1 completion).
- The specific new environment variables for Cloudinary and email delivery (Section 9) — both are consistent with already-documented-but-deferred integration points (`API_SPECIFICATION.md` Section 22 for Cloudinary; `BACKEND_ARCHITECTURE.md` Section 5's explicitly-out-of-scope email delivery mechanism, now needing a concrete choice since Phase B can't ship a non-functional password reset).

**No blocking conflicts identified.** Development may begin at Phase A.
