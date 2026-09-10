# Accessibility & UX Quality — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.7
**Status:** Draft
**Depends on:** DESIGN_SYSTEM.md, COMPONENT_ARCHITECTURE.md, FRONTEND_ARCHITECTURE.md (Section 16)

---

## 1. WCAG Standards

**Keyboard navigation:** every interactive element (including `SplitSelector`'s custom split-mode toggle, `Tooltip` triggers, `Modal` actions) is reachable and operable via `Tab`/`Shift+Tab` and activated via `Enter`/`Space` — no interaction in this application depends on a mouse-only gesture (hover-only tooltips, drag-only controls).

**Focus states:** every focusable element has a visible focus ring (a dedicated `--color-primary`-based outline, never the browser default suppressed without replacement) meeting WCAG's non-text contrast requirement against its background — this is a single consistent focus-ring treatment applied via the Button/Input/Card foundation components (`COMPONENT_ARCHITECTURE.md` Section 1), not styled per-instance.

**Color contrast:** the color system (`DESIGN_SYSTEM.md` Section 2) is chosen to meet WCAG AA (4.5:1 for body text, 3:1 for large text/UI components) by default — `--color-success`/`--color-error` text specifically is verified against `--color-background` and `--color-surface`, since these carry financial meaning and a contrast failure there is a comprehension failure, not just a cosmetic one.

**Screen readers:** semantic HTML is used throughout (`<button>`, `<form>`, `<label>`, `<nav>`) so screen readers get correct roles for free; components without a native semantic equivalent (the segmented split-method control, custom `Select`) carry appropriate ARIA roles/attributes (`role="tablist"`/`radiogroup` pattern, `aria-expanded`, etc.) per `FRONTEND_ARCHITECTURE.md` Section 16's "ARIA only where semantic HTML is insufficient" principle.

**Form accessibility:** every `Input`/`Select`/`Checkbox` has a programmatically associated `<label>` (never a placeholder used as the only label — placeholders disappear on input and fail as a persistent accessible name); required fields are marked with `aria-required`, not color/asterisk alone.

**Error announcements:** a field-level validation error is announced to assistive technology via `aria-live="polite"` on the error message region (or `aria-describedby` linking the input to its error text) the moment it appears — a sighted user sees the red border and inline text; a screen-reader user needs the equivalent event actively announced, not just present in the DOM for them to happen upon.

---

## 2. UX Rules

**Loading feedback:** every async action gives feedback within the interaction itself — a submitting button shows its own spinner (never a page-level overlay for a small mutation), a first-load list shows skeletons matching its eventual content's shape (never a generic spinner that gives no sense of what's coming), per `FRONTEND_ARCHITECTURE.md` Section 14's granular-loading-state principle, restated here as a UX-quality rule, not just a technical one.

**Confirmation dialogs:** required specifically for actions that are either destructive (expense delete, member removal) or represent a real-world financial event being recorded (marking a settlement as paid) — not required for reversible, low-stakes actions (creating a group, editing an expense's description). This distinction matters: over-using confirmation dialogs trains users to click through them without reading, which defeats their purpose for the moments that actually matter.

**Destructive actions:** always use the `Button` `danger` variant (`DESIGN_SYSTEM.md`/`COMPONENT_ARCHITECTURE.md` Section 1) inside a confirmation `Modal` that states the specific consequence in plain language ("This will permanently delete this expense and update the group's balances" — not a generic "Are you sure?"), and the confirm button's label restates the action ("Delete Expense," not just "Confirm") so a user scanning quickly still reads what they're about to do.

**Success feedback:** every completed mutation gets explicit, brief confirmation — a `Toast` for actions that navigate away or update in the background (expense created, member added), or an inline state change for actions visible in place (a settlement moving from "Suggested" to "History," a balance number updating with its brief transition animation, `DESIGN_SYSTEM.md` Section 7). Silence after an action is never treated as acceptable feedback, even when the result is otherwise visible — an explicit signal removes any doubt about whether the action actually completed.

---

## 3. Accessibility & UX Audit Checklist (for implementation-stage verification)

- [ ] Every interactive component keyboard-navigable and operable
- [ ] Focus ring visible and consistent across all foundation components
- [ ] Color contrast verified for all semantic color/background pairings, especially balance-direction colors
- [ ] All form fields have programmatic labels; no placeholder-only labeling
- [ ] Error messages linked via `aria-describedby` and announced via `aria-live`
- [ ] All destructive/financial-event actions gated by a clear, specific confirmation dialog
- [ ] No async action lacks a scoped (not global) loading indicator
- [ ] No completed mutation lacks explicit success feedback
