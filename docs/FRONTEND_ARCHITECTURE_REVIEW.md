# Frontend Architecture Review — Milestone 1.2

**Reviewer role:** Lead Architect sign-off before development begins
**Document under review:** FRONTEND_ARCHITECTURE.md
**Reviewed against:** PROJECT.md, VISION.md, USER_PERSONAS.md, FEATURE_REQUIREMENTS.md, SYSTEM_ARCHITECTURE.md (frozen)

---

## 1. Architecture Quality Review

The feature-based structure is sound and scales the way it's supposed to: a new feature is a new sibling folder, not a modification to several shared directories. Responsibility boundaries (components → features → pages) are correctly layered, and I don't see a folder that's unnecessary or a folder that's obviously missing at V1 scope.

**Gap found:** the document doesn't specify where cross-feature shared types live when a type genuinely spans two features (e.g., a `Balance` type consumed by both `expenses` and `settlements`). Right now `types/` (top-level) is described only as "shared/global TS types," which is correct, but the document should be explicit that a type is promoted to `types/` only when a second feature needs it — not proactively — to avoid `types/` becoming a dumping ground. Minor; not blocking.

**Verdict:** scalable for this product's realistic scope; no major restructuring risk visible.

---

## 2. React Architecture Review

Component hierarchy (UI → Feature → Page) is correctly enforced on paper, pages are described as composition-only, and the "no business logic in components" boundary from Section 1 is consistent throughout. Feature isolation holds — I don't see a feature reaching into another feature's internals; cross-feature data sharing goes through RTK Query's cache and Redux, which is the correct seam.

**Gap found:** the document doesn't address what happens when `SplitSelector` needs to coordinate validation state (running total vs. expense amount) across its three sub-forms and the parent `ExpenseForm`. This is exactly the kind of place hidden coupling creeps in if not planned — either the sub-forms lift validation state to a shared schema (correct) or `ExpenseForm` starts reaching into sub-form internals (coupling). This needs an explicit statement, not just an implication. See Section 7 (Forms) below for the fix.

---

## 3. TypeScript Architecture Review

Strict mode is correctly adopted from day one (ADR-005), and the schema-as-type-source pattern (Zod → `z.infer`) is sound and correctly described for forms.

**Critical gap:** the document never specifies how currency amounts are typed or represented. This is not a nitpick for a financial product — `amount: number` invites floating-point drift the moment it's summed or split (the exact failure mode `PROBLEM_STATEMENT.md` identifies as a reason manual tracking fails). The architecture needs an explicit convention: amounts should be represented as integer cents at the API boundary (matching whatever the backend's `expenseCalculation.service.ts` uses — this must be confirmed as a shared contract, not a frontend-only decision) and only converted to a display-formatted decimal string at the point of rendering. This should be a typed convention (a branded `Cents` type or equivalent), not an implicit assumption.

---

## 4. State Management Review

RTK Query correctly owns all server state; Redux is correctly limited to auth identity, UI preferences, and notifications — no duplication found. The tag-invalidation strategy is described conceptually but not concretely.

**Gap found:** the document says mutations "declare which cache tags they invalidate" but never enumerates the tag set or the invalidation matrix (e.g., does creating an expense invalidate `Balance` and `Settlement` tags for that group, or only `Expense`?). Given that balance/settlement correctness is the product's core promise, this matrix should be explicit, not left to per-endpoint judgment calls made later. Recommend adding a concrete tag table before backend integration (Phase 6) begins.

---

## 5. API Layer Review

`baseApi.ts` as a single shared RTK Query base is correct, and reserving Axios for genuine RTK Query misfits (file uploads) is the right call, not an inconsistency.

**Critical gap:** the refresh-token flow as described (401 → refresh → retry) doesn't address concurrent requests. If three RTK Query calls fire near-simultaneously and all receive 401s, the current description would trigger three separate refresh calls — since refresh tokens rotate on use (per `SYSTEM_ARCHITECTURE.md` Section 5), the second and third refresh attempts would use an already-invalidated token and fail, incorrectly logging the user out even though their session was actually still valid. This needs an explicit single-flight/mutex pattern: the first 401 triggers the refresh call, subsequent concurrent 401s await that same in-flight promise rather than firing their own. This is a correctness issue, not a style preference — flagging as critical.

---

## 6. Authentication Frontend Review

Access-token-in-memory + httpOnly-cookie-refresh is correctly specified and matches modern SaaS practice. Logout flow correctly invalidates server-side, not just client state.

**Gap found:** "session restoration on app load" is mentioned only implicitly ("recovered via a silent refresh call on app load") — this deserves to be a named, explicit flow, since it's a common source of a visible bug (a flash of "logged out" UI before the silent refresh resolves). The document should state that route rendering is gated on this initial refresh attempt resolving (loading state, not a premature redirect to `/login`).

---

## 7. Form Architecture Review

React Hook Form + Zod is well justified (ADR-004) and the three split-mode sub-forms are correctly identified as the highest-complexity form surface in the app.

**Critical gap (ties to Section 3):** the document describes unequal-split and percentage-split validation ("live running total validated against the expense total," "live-validated to sum to 100%") but doesn't specify how that validation avoids the same floating-point problem the backend's split engine has to solve. If the frontend validates using raw floats while the backend computes in integer cents, the two can disagree at the boundary (frontend says "valid," backend rejects, or vice versa) — a bad UX and a sign of an undocumented contract mismatch. The Zod schemas for unequal/percentage splits should validate using the same integer-cents (or percentage-as-integer-basis-points) convention as the backend contract, not independently-invented floating-point logic.

---

## 8. Styling Architecture Review

Design-token approach with semantic colors (Section 11) is correct and will scale. Responsive strategy (mobile-first, reserved breakpoints) is sound.

**Gap found:** dark mode is not addressed at all — not implemented, and not explicitly deferred either. Given the semantic-token approach already in place, dark mode is cheap to defer *if* stated as an intentional non-goal for V1 (consistent with `VISION.md`'s MVP discipline) — but it should be stated, not silently absent, so it doesn't read as an oversight to a reviewer.

---

## 9. Performance Architecture Review

Page-level code splitting, RTK Query caching, and selective memoization are all correctly reasoned. Virtualization is mentioned for long lists.

**Gap found:** "virtualization where needed" has no threshold — worth stating a concrete guideline (e.g., virtualize expense lists above ~100 items) so it's an actual decision point during development, not a vague deferred judgment call. Also worth explicitly noting that Recharts (analytics) and Framer Motion should be scoped to the `analytics` feature's lazy-loaded chunk specifically, not pulled into the main bundle — this is implied by page-level splitting but should be stated given these are the two heaviest third-party dependencies in the stack.

---

## 10. Testing Architecture Review

The testing pyramid described (unit → component → integration → E2E) correctly protects the core loop (login → group → expense → balance → settlement), and scoping E2E to three high-value flows rather than broad coverage is the right call for a solo-developer project.

**Gap found — must fix:** the current document's Section 15 doesn't name specific tools. This review's context specifies **Vitest + React Testing Library** (unit/component/integration) and **Playwright** (E2E) as the confirmed stack — the document needs to state these explicitly rather than describing testing categories abstractly, since tool choice affects folder conventions (e.g., `*.test.tsx` colocation) that should be settled now, not during Phase 7.

---

## 11. Accessibility Review

Semantic HTML, keyboard navigation, ARIA-only-where-needed, focus management, and contrast-by-token are all correctly addressed and consistent with WCAG AA intent. No gaps found beyond what's already documented.

---

## 12. Developer Experience Review

Folder structure is discoverable and the "no catch-all `misc/`/`helpers/`" discipline (Section 3) is a good sign for long-term maintainability. Naming conventions aren't explicitly enumerated (e.g., PascalCase components, camelCase hooks) but this is a minor, easily-added convention note rather than an architectural gap.

---

## 13. Production Missing Pieces

Assessed against the full checklist, scoped appropriately for a solo-developer portfolio SaaS (not flagging enterprise concerns as gaps):

- **Error boundaries** — only a single global boundary is described; recommend adding route-level boundaries as well, so one feature's render error doesn't blank the entire app shell. *Recommended improvement.*
- **Environment configuration** — not addressed in this document at all (API base URL per environment, etc.). Belongs here or in a short addition, since it's frontend-specific (backend env config is already covered in `SYSTEM_ARCHITECTURE.md`). *Missing — should be added.*
- **Feature flags** — not needed at this scope; correctly and reasonably absent, doesn't need a stated non-goal.
- **Analytics tracking** (product usage analytics, not the in-app spending Analytics feature) — absent; reasonable to state as an explicit V1 non-goal rather than silently missing.
- **Logging strategy (client-side)** — absent. Recommend a minimal client-side error-reporting hook (even just structured `console.error` in dev, with a stub for a future Sentry-style integration) so production errors aren't invisible.
- **Monitoring hooks** — reasonable to defer entirely at this scope; no action needed.
- **Internationalization readiness** — absent; reasonable as an explicit non-goal, consistent with `VISION.md`'s scope discipline.
- **Security improvements** — covered adequately in Section 17; CSP headers are a backend/deployment concern, correctly out of this document's scope.
- **SEO** — not applicable; this is an authenticated SPA, correctly unaddressed.
- **Offline handling** — absent; recommend stating this as an intentional non-goal (graceful network-error messaging exists per Section 13 of the original document, which is sufficient — true offline support is not needed for this product).
- **Progressive enhancement** — not applicable to an authenticated SaaS dashboard; correctly unaddressed.

---

## 14. Architectural Decision Record Review

ADR-001 through ADR-005 are well-justified, each with a real alternative and a concrete rejection reason — no weak ADRs found among the existing five.

**Missing ADRs, given this review's findings:**
- An ADR is needed for the **refresh-token concurrency/single-flight pattern** (Section 5 above) — this is a real architectural decision with an alternative (naively retry per-request) that was implicitly rejected without being recorded.
- An ADR is needed for **testing tool selection** (Vitest + RTL + Playwright vs. Jest + Cypress), since this review is the point at which that stack is confirmed — it should be recorded with reasoning, not just assumed.

---

## 15. Final Architect Verdict

### A. Architecture Score
**Frontend Architecture Quality: 8.5/10** — strong structural foundation with correct boundaries; the deductions are for two correctness-adjacent gaps (currency precision convention, refresh-token concurrency) that are cheap to fix now and expensive to discover mid-development.

### B. Approval Status
**APPROVED WITH MINOR CHANGES**

### C. Critical Issues (must fix before development)
1. **Currency/amount typing convention undefined** — establish integer-cents (or equivalent) as the shared frontend/backend contract before any form or API type is implemented (Section 3, Section 7).
2. **Refresh-token concurrency not handled** — the described flow will incorrectly log out users under concurrent-request conditions; needs a single-flight refresh pattern (Section 5).
3. **Testing tools not named in the document** — Section 15 of the original document must specify Vitest, React Testing Library, and Playwright explicitly (Section 10 of this review).

### D. Recommended Improvements (non-blocking, increase production quality)
- Add route-level error boundaries alongside the global one.
- State environment configuration handling explicitly (API base URL per environment).
- State dark mode, product-analytics tracking, i18n, and offline support as explicit V1 non-goals rather than silent omissions.
- Add a concrete cache-tag invalidation matrix before Phase 6 (API integration) begins.
- State a virtualization threshold (e.g., ~100 items) rather than "where needed."
- Add a minimal client-side error-logging stub.

### E. Updated Sections
Applying now as targeted edits to `FRONTEND_ARCHITECTURE.md`:
- Section 6 (API Layer Architecture) — add single-flight refresh handling.
- Section 7 (Authentication Frontend Architecture) — add explicit session-restoration gating.
- Section 10 (Form Architecture) — add currency-precision contract note.
- Section 15 (Testing Strategy) — name tools explicitly.
- Section 18 (ADRs) — add ADR-006 (refresh concurrency) and ADR-007 (testing tooling).
- New Section 19 — Explicit V1 Non-Goals (styling, analytics, i18n, offline) and environment configuration note.

---

## Frontend Architecture Approval Checklist

- [x] Feature-based structure reviewed and approved
- [x] Component/page/feature boundaries verified — no leakage found
- [x] State ownership (RTK Query vs. Redux vs. local) verified — no duplication
- [x] Auth token strategy verified against modern SaaS standards
- [ ] **Currency/amount typing convention — must be added before form/API implementation**
- [ ] **Refresh-token single-flight handling — must be added before auth implementation**
- [ ] **Testing tools explicitly named — must be added before Phase 7, ideally now**
- [x] Accessibility approach reviewed and approved
- [x] ADRs reviewed; two additions identified and being added
- [x] No unnecessary enterprise complexity introduced

**Development may begin once the three critical items are reflected in `FRONTEND_ARCHITECTURE.md`** (being applied now) — none require new tooling or scope changes, only documentation of decisions that were implicit.
