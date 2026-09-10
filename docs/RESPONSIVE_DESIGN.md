# Responsive Design Strategy — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.6
**Status:** Draft
**Depends on:** DESIGN_SYSTEM.md, COMPONENT_ARCHITECTURE.md, IA.md (Section 4)

Mobile-first: base styles target the smallest breakpoint; larger breakpoints add layout, not remove functionality — every capability available on desktop is available on mobile, only the presentation adapts (consistent with all three personas using this product primarily from a phone in the moment an expense actually happens).

---

## 1. Breakpoints

```
--breakpoint-mobile   0–639px     /* base styles, no prefix */
--breakpoint-tablet    640–1023px  /* sm:/md: */
--breakpoint-desktop    1024–1439px /* lg: */
--breakpoint-large       1440px+     /* xl: */
```
Matches Tailwind's default breakpoint scale directly (`FRONTEND_ARCHITECTURE.md` Section 11) — no custom override, so utility classes behave predictably without a mental remapping step.

---

## 2. Navigation Behavior

**Mobile (0–639px):** bottom navigation bar (Dashboard, Profile — per `IA.md` Section 4) fixed to the viewport bottom; group-detail secondary nav (Expenses/Balances/Settlement/Analytics) renders as a horizontally scrollable tab bar directly under the group header. No hamburger menu — the nav-item count (two primary, four secondary-in-context) doesn't warrant hiding navigation behind an extra interaction.

**Tablet (640–1023px):** bottom navigation is replaced by a slim top navbar (primary items now fit comfortably without crowding); secondary tab bar remains as on mobile but no longer needs horizontal scroll.

**Desktop (1024px+):** persistent left sidebar for primary navigation (Sidebar component, `COMPONENT_ARCHITECTURE.md` Section 2); secondary tab bar renders as a standard horizontal tab row within the group-detail content area.

---

## 3. Dashboard Adaptation

- **Mobile:** single-column group card list (Grid `columns: { base: 1 }`).
- **Tablet:** two-column grid (`columns: { md: 2 }`).
- **Desktop/large:** three-column grid (`columns: { lg: 3 }`), capped at three even on very wide viewports — group cards stay a comfortable reading width rather than stretching thin across an ultra-wide layout.

---

## 4. Tables → Cards Conversion

The Expenses list and Settlement History are the two "table-like" dense data views in the app.

- **Desktop (1024px+):** rendered as a structured row layout — payer avatar, description, category tag, amount, date in fixed columns, scannable at a glance across many rows.
- **Mobile/tablet:** the same data renders as stacked ExpenseCard components (`COMPONENT_ARCHITECTURE.md` Section 3) — amount and description as the primary line, payer/category/date condensed into a secondary line beneath. This is not the same component with CSS media queries hiding columns; it's a deliberately different information hierarchy suited to a narrow viewport, since simply hiding table columns on mobile tends to strip exactly the context (who paid, what category) that makes a row meaningful at a glance.

---

## 5. Chart Responsiveness

Every chart (`ChartCard`, wrapping Recharts) uses `ResponsiveContainer` so it resizes fluidly to its parent width rather than requiring per-breakpoint layout logic. On mobile, the three Analytics sections (category/trend/contribution) stack in a single column with full-width charts; on desktop, they arrange in a two-column layout (category + contribution side-by-side, trend full-width beneath, since a time-series benefits from more horizontal space than a category breakdown does). Chart label density (e.g., number of x-axis ticks on the trend chart) reduces on mobile to avoid label overlap, rather than shrinking font size below the accessibility-safe minimum (`ACCESSIBILITY_UX.md` Section 1).

---

## 6. Forms Optimization

- **Mobile:** all form fields stack in a single column at full width (never a multi-column form layout, even for related short fields like date + category) — multi-column forms are a common source of mis-tapped fields on small touch targets.
- **The `SplitSelector`'s participant rows** (`COMPONENT_ARCHITECTURE.md` Section 3) are already single-column at every breakpoint by design — no adaptation needed, since cramming participant amount fields into columns would work directly against the financial-clarity principle (`DESIGN_SYSTEM.md` Section 1) by making individual share amounts harder to scan.
- **Desktop:** forms remain single-column but gain more generous spacing (`--space-6`/`--space-8` between field groups rather than mobile's tighter `--space-4`) — width is capped (`Container size="narrow"`, `COMPONENT_ARCHITECTURE.md` Section 2) rather than letting form fields stretch to a wide viewport's full width, which would hurt readability of short fields like amount or date.
- **Touch targets:** every interactive element (buttons, checkboxes, select triggers) maintains a minimum 44×44px touch target on mobile/tablet regardless of its visual size, per standard mobile accessibility guidance — this is a floor applied uniformly via component padding, not a per-instance adjustment.
