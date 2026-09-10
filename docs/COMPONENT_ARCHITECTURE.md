# UI Component Architecture — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.5
**Status:** Draft
**Depends on:** DESIGN_SYSTEM.md, WIREFRAMES.md, FRONTEND_ARCHITECTURE.md (Sections 3, 9)

Maps directly onto the folder structure already fixed in `FRONTEND_ARCHITECTURE.md` Section 3 — Foundation and Layout components live in `components/ui/`/`components/common/`; Feature components live in each feature's `components/` folder.

---

## 1. Foundation Components (`components/ui/`)

### Button
- **Purpose:** all clickable actions across the app.
- **Props:** `variant` (`primary` | `secondary` | `danger` | `ghost`), `size` (`sm` | `md` | `lg`), `isLoading`, `isDisabled`, `onClick`, `children`.
- **States:** default, hover, active/pressed, focus (visible ring, `ACCESSIBILITY_UX.md` Section 1), disabled, loading (inline spinner replaces label, per `FRONTEND_ARCHITECTURE.md` Section 14).
- **Variants:** `danger` reserved exclusively for destructive actions (expense delete, member removal) — never reused for a merely "important" primary action, so its visual weight stays a reliable warning signal.
- **Responsive behavior:** full-width on mobile within a form context; auto-width elsewhere — no other breakpoint-specific behavior.

### Input
- **Purpose:** single-line text/number entry.
- **Props:** `label`, `type`, `error?`, `helperText?`, `value`, `onChange`, `isDisabled`.
- **States:** default, focus, error (red border + inline message, `--color-error`), disabled.
- **Variants:** a `currency` variant (used for `amountCents` fields) formats display as the user types while the underlying value remains an integer-cents number — never a free-text field for money (`FRONTEND_ARCHITECTURE.md` Section 10's currency contract enforced at the component level).
- **Responsive behavior:** full-width within its container at all breakpoints.

### Select
- **Purpose:** single-choice selection (category, payer).
- **Props:** `label`, `options`, `value`, `onChange`, `error?`.
- **States/Variants:** identical pattern to Input.

### Checkbox
- **Purpose:** multi-select (equal-split participant selection).
- **Props:** `label`, `checked`, `onChange`, `isDisabled`.
- **States:** default, checked, focus, disabled.

### Modal
- **Purpose:** confirmation dialogs (Section 3, `ACCESSIBILITY_UX.md`) and any focused, blocking interaction.
- **Props:** `isOpen`, `onClose`, `title`, `children`, `footer` (action buttons).
- **States:** open/closed, with enter/exit transitions (`--duration-base`).
- **Behavior:** traps and restores focus (`ACCESSIBILITY_UX.md` Section 1); closes on `Escape` and backdrop click for non-destructive content, but requires explicit button interaction (no backdrop-dismiss) for destructive confirmations specifically, so a stray click can't accidentally cancel — or worse, be misread as confirming — a delete action.
- **Responsive behavior:** centered floating panel on desktop; full-width bottom sheet on mobile (`RESPONSIVE_DESIGN.md` Section 2).

### Toast
- **Purpose:** transient, non-blocking feedback (success confirmations, non-critical errors).
- **Props:** `variant` (`success` | `error` | `info`), `message`, `duration`.
- **Behavior:** auto-dismisses (default ~4s) but is also manually dismissible; stacks (multiple toasts) rather than replacing each other, per `FRONTEND_ARCHITECTURE.md` Section 5's notification-queue state.

### Tooltip
- **Purpose:** supplementary explanation for a non-obvious control (e.g., explaining what "percentage split" means the first time a new user encounters it).
- **Props:** `content`, `children` (the trigger element).
- **Behavior:** keyboard-accessible (appears on focus, not only hover) — required for the keyboard-navigation rule in `ACCESSIBILITY_UX.md` Section 1.

---

## 2. Layout Components (`components/common/` and `layouts/`)

### Navbar
- **Purpose:** top-level app chrome — primary navigation (Section 2, `IA.md`), user menu.
- **Props:** none (reads auth state internally via `useAuth`).
- **Responsive behavior:** full nav on desktop; collapses to the bottom-nav pattern on mobile (`RESPONSIVE_DESIGN.md` Section 2) — effectively two distinct rendered components sharing the same navigation *data*, not one component visually squeezed.

### Sidebar
- **Purpose:** (desktop only) persistent primary navigation alongside content.
- **Props:** none.
- **Responsive behavior:** hidden below the tablet breakpoint, replaced entirely by Navbar's mobile pattern — not a collapsing/hamburger version of itself.

### Container
- **Purpose:** consistent max-width + horizontal padding wrapper for page content.
- **Props:** `size` (`default` | `narrow` — narrow used for single-column forms like auth screens).

### Grid
- **Purpose:** responsive card-grid layout (Dashboard's group cards).
- **Props:** `columns` (responsive object, e.g., `{ base: 1, md: 2, lg: 3 }`).

### Card
- **Purpose:** the base elevated-surface container reused across GroupCard, ExpenseCard-adjacent contexts, and any boxed content.
- **Props:** `padding`, `children`, `onClick?` (renders as interactive when present, with hover/focus states).
- **States:** default, hover/focus (only when `onClick` is provided).

---

## 3. Feature Components

### Expense Feature (`features/expenses/components/`)

**ExpenseCard** (list-row presentation)
- **Purpose:** summary row within the Expenses list.
- **Props:** `expense` (id, payer, amountCents, description, category, date), `onClick`.
- **States:** default, hover/focus (navigable).
- **Responsive:** full data row on desktop; condensed two-line layout (amount+description primary, payer+date secondary) on mobile.

**ExpenseForm**
- **Purpose:** create/edit expense (shared between both flows, per `FRONTEND_ARCHITECTURE.md` Section 4's reuse note).
- **Props:** `groupMembers`, `initialValues?` (present for edit), `onSubmit`, `isSubmitting`.
- **States:** pristine, validating, submitting, error (field-level + split-level).
- **Variants:** none — the form is one component; its internal split sub-form varies via `SplitSelector`.

**SplitSelector**
- **Purpose:** the split-method-specific sub-form (Section 4, `FRONTEND_ARCHITECTURE.md`).
- **Props:** `method` (`equal` | `unequal` | `percentage`), `participants`, `totalCents`, `value`, `onChange`.
- **States:** valid (sum matches), invalid (running total/percentage mismatch — shown inline, persistent while invalid, per `WIREFRAMES.md`).
- **Variants:** three distinct internal layouts per `method`, switched via a segmented control, not three separate top-level components — they share validation-display and total-amount-reference logic.
- **Responsive:** participant rows stack vertically at all breakpoints (already the natural layout); no structural change, only spacing tightens on mobile.

### Group Feature (`features/groups/components/`)

**GroupCard**
- **Purpose:** Dashboard grid item.
- **Props:** `group` (id, name, memberCount), `onClick`.
- **States:** default, hover/focus.

**MemberList**
- **Purpose:** group header's member management panel.
- **Props:** `members` (with `status`), `onAddMember`, `onRemoveMember`, `currentUserId`.
- **States:** default; a `removed` member is never rendered here (Section 5 of `SECURITY_ARCHITECTURE.md` — soft-removed members don't appear in the active-member list a user manages, even though they remain attributable in historical expense data elsewhere).
- **Behavior:** removal action is behind a confirmation dialog (destructive-adjacent — removes access, though not data).

### Finance Components (`features/settlements/components/`, `features/expenses/` shared)

**BalanceCard**
- **Purpose:** per-member row in the Balances tab.
- **Props:** `user` (name, avatar), `balanceCents`.
- **Variants:** `owed` (positive, `--color-success`), `owes` (negative, `--color-error`), `settled` (zero, neutral) — three explicit visual variants, never a single component silently recoloring based on a numeric sign check alone (the variant is computed once and passed explicitly, keeping the color/label pairing consistent, per `DESIGN_SYSTEM.md` Section 2).

**SettlementCard**
- **Purpose:** a single suggested-payment row in the Settlement tab.
- **Props:** `from`, `to`, `amountCents`, `onMarkPaid`, `isProcessing`.
- **States:** default, processing (post-confirmation, awaiting server response), settled (transitions out of the suggestions list into history).

**ChartCard**
- **Purpose:** wraps a single Recharts visualization (category/trend/contribution) with a consistent card frame, title, and loading/empty state.
- **Props:** `title`, `isLoading`, `isEmpty`, `children` (the chart itself).
- **States:** loading (skeleton), empty ("Not enough data yet," per `WIREFRAMES.md`), populated.
- **Responsive:** chart internally resizes to container width (Recharts' `ResponsiveContainer`); the card's own width follows the Grid layout's breakpoint behavior (`RESPONSIVE_DESIGN.md`).

---

## 4. Component Reuse Summary

| Reused across | Component |
|---|---|
| Every form in the app | Input, Select, Checkbox, Button |
| Every destructive action | Modal (confirmation variant) |
| Every list screen | Card (as row/item base), skeleton loading pattern |
| Every async mutation | Button's `isLoading` state, Toast for outcome feedback |

No feature introduces a one-off component that duplicates a Foundation component's job — this table is the practical check against that (`FRONTEND_ARCHITECTURE.md` Section 9's component responsibility rule applied at the design-system level).
