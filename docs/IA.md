# Information Architecture — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.1
**Status:** Draft
**Depends on:** FRONTEND_ARCHITECTURE.md (routing, Section 8), API_SPECIFICATION.md (resource structure)

---

## 1. Product Navigation Hierarchy

**Public Area** (unauthenticated):
```
Landing Page
├── Login
├── Register
└── Forgot Password → Reset Password (token-based entry)
```

**Authenticated Area:**
```
Dashboard (groups overview)
│
├── Groups (list — GET /groups)
│
├── Group Detail (:groupId)
│   ├── Expenses (list + create/edit/detail)
│   ├── Balances
│   ├── Settlement (suggestions + record + history)
│   └── Analytics (category / trend / contribution)
│
└── Profile (own account — GET/PATCH /users/me)
```

**Why no separate "Settings" section:** `FEATURE_REQUIREMENTS.md` V1 has no app-level settings beyond the user's own profile (no notification preferences, no billing, no admin panel) — a dedicated "Settings" nav item would be empty scaffolding. Profile absorbs the one V1 capability (name/avatar edit) that would otherwise live there; a Settings section is added later only if a real V2 setting requires it.

---

## 2. Primary Navigation

Persistent across the authenticated area (desktop: sidebar; mobile: see Section 4):
- **Dashboard** (home — list of the user's groups)
- **Profile** (account)

Primary navigation is deliberately shallow — two items — because the actual working context of this product is *inside a group*, not at the app's top level. This matches the core loop from `FEATURE_REQUIREMENTS.md` Section 1: users spend almost all their time within a specific group's expenses/balances/settlement, not navigating between top-level sections.

## 3. Secondary Navigation

Within a Group Detail context, a secondary nav (tabs, per Section 6 of `RESPONSIVE_DESIGN.md`) switches between: **Expenses | Balances | Settlement | Analytics**. This is scoped entirely to the active group and disappears when navigating back to Dashboard — it's context-specific, not app-global, mirroring `FRONTEND_ARCHITECTURE.md` Section 8's nested-route structure under `GroupDetailLayout`.

## 4. Mobile Navigation

- **Primary nav** collapses to a bottom navigation bar with two destinations (Dashboard, Profile) plus a persistent "back to groups" affordance when inside a group context — not a hamburger menu, since two top-level destinations don't warrant hiding behind an extra tap (hamburger menus are justified by nav-item count, not screen size alone).
- **Secondary nav** (the group-detail tabs) becomes a horizontally scrollable tab bar directly beneath the group header, consistent with the same four-tab structure used on desktop — no items are hidden or reorganized between breakpoints, only their presentation changes (elaborated in `RESPONSIVE_DESIGN.md`).

## 5. User Journey Entry Points

- **New user:** Landing Page → Register → (redirected to) Dashboard, empty state prompting group creation.
- **Returning user, no active session:** Landing Page or direct deep link → Login → redirected to originally-intended destination (if any) or Dashboard.
- **Returning user, valid session:** any deep link (e.g., a shared group URL) resolves directly, gated by the silent session-restoration flow (`FRONTEND_ARCHITECTURE.md` Section 7).
- **Password reset:** entry via emailed link containing the reset token → Reset Password screen (public, token-gated) → redirected to Login on success.
- **Invited to a group:** V1 has no invite-link flow (`API_SPECIFICATION.md` Section 17 — members are added by email to an existing account only) — the entry point for a newly-added member is simply logging in and finding the group already present on their Dashboard; no dedicated "you've been added" screen exists in V1.

## 6. URL Structure Alignment

Directly mirrors the frontend route tree already fixed in `FRONTEND_ARCHITECTURE.md` Section 8, which itself mirrors the API's resource structure (`API_SPECIFICATION.md` Section 23):

| URL | Screen |
|---|---|
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Public |
| `/dashboard` | Group list |
| `/groups/:groupId` | Group detail (defaults to Expenses tab) |
| `/groups/:groupId/expenses` | Expenses tab |
| `/groups/:groupId/expenses/:expenseId` | Expense detail |
| `/groups/:groupId/balances` | Balances tab |
| `/groups/:groupId/settlement` | Settlement tab |
| `/groups/:groupId/analytics` | Analytics tab |
| `/profile` | Profile |

No URL introduces a resource shape the API doesn't already expose — this is a direct, intentional 1:1 mapping, so no frontend route ever needs to fetch data the API can't serve.
