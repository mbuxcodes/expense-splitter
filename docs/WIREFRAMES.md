# Wireframe Strategy — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.3
**Status:** Draft
**Depends on:** IA.md, USER_FLOWS.md

Low-fidelity structural specifications — layout and content hierarchy, not visual design (that's `DESIGN_SYSTEM.md`).

---

## Public Screens

### Landing Page
- **Purpose:** convert a visitor into a registered user.
- **User goal:** understand what the product does in a few seconds, then act.
- **Layout:** centered hero (headline + one-line value proposition) → primary CTA ("Get Started" → Register) → secondary CTA (Login link) → brief feature highlights (three columns: split fairly, always-current balances, minimal settlement).
- **Content hierarchy:** headline > CTA > supporting detail.
- **Main action:** Register. **Secondary action:** Login.
- **States:** static content only — no loading/empty/error states apply.

### Login
- **Purpose:** authenticate a returning user.
- **User goal:** get back into their groups as fast as possible.
- **Layout:** centered single-column form — email, password, submit; "Forgot password?" link below; "New here? Register" below that.
- **Main action:** Submit (Login). **Secondary action:** navigate to Register or Forgot Password.
- **Loading state:** submit button shows inline spinner, form fields disabled during submission.
- **Error state:** generic credential-error banner above the form (Section 1, `USER_FLOWS.md`).

### Register
- **Purpose:** create a new account.
- **Layout:** centered single-column form — name, email, password, submit.
- **Main action:** Submit. **Secondary action:** navigate to Login.
- **Error state:** field-level (email taken); loading state identical pattern to Login.

### Forgot Password
- **Purpose:** initiate a password reset.
- **Layout:** centered single-field form (email) + submit; post-submit, form is replaced by a confirmation message (Section 1, `USER_FLOWS.md`).
- **Main action:** Submit.

---

## App Screens

### Dashboard (Group List)
- **Purpose:** entry point showing all groups the user belongs to.
- **User goal:** find the group they want to act in, or start a new one.
- **Layout:** page header ("Your Groups" + "New Group" primary action, top-right) → grid/list of group cards (name, member count, small avatar stack).
- **Main action:** New Group. **Secondary action:** select a group card (navigates to Group Detail).
- **Empty state:** no groups yet — centered prompt with the New Group action, replacing the grid entirely.
- **Loading state:** skeleton grid of card placeholders.

### Group Detail (shell, wraps the four tabs)
- **Purpose:** the group's home context.
- **Layout:** group header (name, member avatars, "Members" action) → tab bar (Expenses | Balances | Settlement | Analytics) → tab content area.
- **Main action:** varies by active tab. **Secondary action:** Members management (via header, not a tab — Section 2 of `USER_FLOWS.md`).

### Expenses (tab)
- **Purpose:** view and manage the group's expense record.
- **Layout:** "Add Expense" action (top-right) → paginated list of expense rows (payer avatar, description, category tag, amount, date) → load-more on scroll/click (cursor pagination).
- **Main action:** Add Expense. **Secondary action:** select a row (Expense Detail).
- **Empty state:** onboarding-style prompt (Section 3, `USER_FLOWS.md`).
- **Loading state:** skeleton rows on first load; inline spinner on load-more.

### Expense Creation
- **Purpose:** record a new expense.
- **Layout:** single-column form — amount, description, category (select), date, payer (select from members), split method (segmented control: Equal/Unequal/Percentage), then the method-specific participant/share sub-form, submit.
- **Main action:** Submit. **Secondary action:** Cancel (returns to Expenses tab).
- **Error state:** inline per-field, plus a split-level validation message (running total vs. target) shown persistently while the split sub-form is incomplete/invalid.
- **Loading state:** submit button spinner; form remains visible and disabled during submission (not replaced by a page-level spinner).

### Expense Details
- **Purpose:** view (and access edit/delete for) a single expense's full record, including its split breakdown.
- **Layout:** header (description, amount, category, date, payer) → split breakdown list (each participant + their share) → Edit / Delete actions.
- **Main action:** Edit. **Secondary action:** Delete (behind a confirmation dialog, Section 3 of `ACCESSIBILITY_UX.md` — destructive).

### Balance View
- **Purpose:** show each member's current standing.
- **Layout:** list of member rows — avatar, name, signed balance amount with directional color/label ("owed $20" / "owes $20" / "settled up").
- **Main action:** none primary (a read-only view) — implicit navigation to Settlement tab is the natural next step, surfaced via a contextual prompt if any non-zero balances exist.
- **Empty state:** "Everyone's settled up" when all balances are zero (a positive empty state, not a neutral one).
- **Loading state:** skeleton rows.

### Settlement View
- **Purpose:** show minimum-transaction settlement suggestions and record completed payments.
- **Layout:** "Suggested Payments" section (from/to/amount rows, each with "Mark as Paid") → "Settlement History" section below (past completed settlements, paginated).
- **Main action:** Mark as Paid (per suggestion, behind confirmation). **Secondary action:** none beyond viewing history.
- **Empty state (suggestions):** "No payments needed — everyone's settled up," consistent with the Balance View's positive framing.
- **Loading state:** skeleton for both sections independently.

### Analytics Dashboard
- **Purpose:** visualize group spending patterns.
- **Layout:** three independent sections — Category Breakdown (chart), Monthly Trend (chart), Member Contribution (chart) — stacked vertically on mobile, potentially a 2-column arrangement on larger screens (`RESPONSIVE_DESIGN.md`).
- **Main action:** none (read-only); an optional date-range filter applies to all three sections.
- **Empty state:** "Not enough data yet" per section if the group has no/minimal expense history, rather than rendering an empty or broken chart.
- **Loading state:** each section loads and renders independently (Section 2, `USER_FLOWS.md`) — a skeleton chart placeholder per section.

### Profile
- **Purpose:** view/edit the user's own account info.
- **Layout:** avatar + name + email (read-only) → editable fields (name, avatar) → Save action → Logout action, visually separated (a distinct, lower-emphasis zone) from the editable form.
- **Main action:** Save. **Secondary action:** Logout.
- **Error state:** inline field validation on save.
