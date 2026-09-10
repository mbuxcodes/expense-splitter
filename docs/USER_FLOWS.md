# User Experience Flows — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.2
**Status:** Draft
**Depends on:** IA.md, API_SPECIFICATION.md, SECURITY_ARCHITECTURE.md

---

## 1. Authentication Flows

**Register:** Landing → Register form (email, password, name) → client validation (Zod) → submit → on `201`, redirect to Login with a success message ("Account created — log in to continue") — no auto-login, per `API_SPECIFICATION.md` Section 14's deliberate separation of account creation from session creation. On `409 USER_EMAIL_EXISTS`, inline field error on email, not a generic toast.

**Login:** Login form → submit → on success, redirect to Dashboard (or the originally-requested deep link, Section 5 of `IA.md`). On `401 AUTH_INVALID_CREDENTIALS`, a single generic error message ("Incorrect email or password") — never distinguishing "wrong password" from "no such account," consistent with the enumeration-prevention design in `SECURITY_ARCHITECTURE.md` Section 7.

**Logout:** User-initiated from Profile or primary nav → immediate optimistic redirect to Login, session cleared client-side, `POST /auth/logout` fired in the background — the user isn't made to wait on the network call to see the logout take effect.

**Refresh session:** Invisible to the user in the success case (`FRONTEND_ARCHITECTURE.md` Section 7) — a brief app-level loading state on initial load while silent refresh resolves; on failure, redirect to Login with no error messaging (an expired session isn't a user error).

**Password reset:** Login screen → "Forgot password?" → email entry → generic confirmation ("If that email exists, we've sent a reset link") regardless of outcome (enumeration prevention) → user follows emailed link → Reset Password screen (new password + confirm) → on success, redirect to Login with confirmation, all other sessions invalidated silently server-side (`SECURITY_ARCHITECTURE.md` Section 3).

---

## 2. Core Product Flows

**Create group:** Dashboard → "New Group" action → name entry (single field) → submit → redirect directly into the new group's Expenses tab (empty state, Section 4 below) — no intermediate confirmation screen, since group creation is low-stakes and reversible in impact (an empty, unused group has no real cost).

**Add members:** Group Detail → Members (accessible from group header, not a separate nav tab, since membership management is infrequent relative to expense activity) → "Add Member" → email entry → submit → new member appears in the list immediately (optimistic, reconciled against the real response) or an inline error if the email doesn't resolve to an existing account (`404 USER_NOT_FOUND`) or is already an active member (`409`).

**Create expense:** Expenses tab → "Add Expense" → form: amount, description, category, date, payer, split method → **split method selection branches the form** (Section 7 of `FRONTEND_ARCHITECTURE.md`'s `SplitSelector`): Equal shows a participant checklist only; Unequal shows per-participant amount fields with a live running-total indicator against the entered amount; Percentage shows per-participant percentage fields with a live sum indicator against 100%. Submit is disabled until the active split mode's validation passes (sum matches, per `API_SPECIFICATION.md` Section 18). On success, return to the Expenses list with the new expense visible at the top and balances silently updated in the background (RTK Query cache invalidation, `FRONTEND_ARCHITECTURE.md` Section 5).

**Split expense:** (part of the create-expense flow above, not a separate flow — splitting is a mode within expense creation/editing, never a standalone action.)

**View balances:** Balances tab, always current on load (no manual "calculate" action — per the always-current promise in `BACKEND_ARCHITECTURE.md` Section 11) — each member shown with a signed amount (owed/owes) and a directional visual treatment (Section 8 of `DESIGN_SYSTEM.md`).

**Settle payment:** Settlement tab shows the current minimum-transaction suggestions ("Alex pays Sam $30") → user selects a suggestion → "Mark as Paid" → confirmation dialog (a financial state change, warrants explicit confirmation per Section 3 of `ACCESSIBILITY_UX.md`) → `POST /settlements` → suggestion moves to the Settlement History list, balances update.

**View analytics:** Analytics tab → three chart sections (category breakdown, monthly trend, member contribution) load independently and progressively (each its own loading state, not one blocking spinner for all three) — a user can see category data before trend data finishes loading.

---

## 3. Error States

- **Network failure:** a distinct "Couldn't connect — check your connection" message with a manual retry action, visually distinct from a validation or auth error (never the generic error toast) — per `FRONTEND_ARCHITECTURE.md` Section 13.
- **Unauthorized user** (`403 GROUP_ACCESS_DENIED`, e.g., a stale/shared link to a group the user isn't a member of): a dedicated "You don't have access to this group" screen, not a raw error toast over a broken layout — this is a navigable dead-end, not a transient failure.
- **Empty states:** every list screen (Groups, Expenses, Settlement History) has a purpose-specific empty state, not a generic "No data" — e.g., Expenses empty state reads "No expenses yet — add your first one" with the Add Expense action directly available, turning the empty state into an onboarding nudge rather than a dead end.
- **Validation errors:** inline, field-level, appearing as the user leaves a field (not only on submit) for immediate feedback — server-confirmed errors (Section 10 of `FRONTEND_ARCHITECTURE.md`) map back onto the same field position, so a client-caught and server-caught error look identical to the user.
- **Loading states:** differentiated by scope per `FRONTEND_ARCHITECTURE.md` Section 14 — page skeletons on first load, inline button spinners on submit, background refresh with no visible interruption for already-rendered data.
