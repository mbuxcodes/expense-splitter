# Design System — Expense Splitter (Enhanced)

**Phase:** 2 — Product Design & UX
**Milestone:** 2.4
**Status:** Draft
**Depends on:** VISION.md (product philosophy), WIREFRAMES.md

---

## 1. Design Principles

- **Trust** — every number on screen should feel verifiable, not just displayed; nothing in the visual language should make a balance or split feel provisional or uncertain.
- **Financial clarity** — money is always the most visually prominent element on any screen it appears on; amounts are never de-emphasized relative to surrounding metadata (category tags, dates).
- **Simplicity** — the interface never presents more than the current task requires (`VISION.md`'s Simplicity Over Complexity principle) — no dashboard widget or stat exists purely for visual density.
- **Speed** — interactions feel immediate; this is a design-system-level commitment as much as a performance one (Section 7's motion durations are chosen specifically to feel fast, not decorative).
- **Transparency** — directional financial states (owed vs. owes) are never ambiguous — color, iconography, and language work together, never relying on color alone (accessibility, Section 6 of `ACCESSIBILITY_UX.md`).

---

## 2. Color System

CSS-variable-friendly, semantic naming — components reference semantic tokens, never raw color values (`FRONTEND_ARCHITECTURE.md` Section 11).

```
--color-primary        #2563EB   /* actions, links, active states */
--color-primary-hover  #1D4ED8
--color-secondary      #7C3AED   /* used sparingly — accent/highlight only */

--color-success        #16A34A   /* "owed to you" balances, confirmations */
--color-warning        #D97706   /* pending/unsettled states */
--color-error           #DC2626   /* "you owe" balances, destructive actions, errors */

--color-neutral-50      #F9FAFB
--color-neutral-100      #F3F4F6
--color-neutral-300       #D1D5DB
--color-neutral-500        #6B7280
--color-neutral-700         #374151
--color-neutral-900          #111827

--color-background            #FFFFFF   /* light mode base — dark mode deferred, FRONTEND_ARCHITECTURE.md Section 19 */
--color-surface                #F9FAFB   /* cards, elevated panels */
--color-surface-border           #E5E7EB
```

**Financial-state color pairing:** `--color-success` and `--color-error` are reserved specifically for balance direction (owed/owes) and are not reused elsewhere for unrelated success/error UI — e.g., a form validation error uses `--color-error` too, but a *balance* being negative is never confusable with a *system* error because it's always paired with explicit directional text ("you owe"), never color alone.

---

## 3. Typography System

```
--font-family-base    'Inter', system-ui, sans-serif   /* legible at small sizes, wide language support */

--font-size-xs    12px   /* metadata: dates, timestamps */
--font-size-sm    14px   /* secondary text, labels */
--font-size-base  16px   /* body text, form inputs */
--font-size-lg    18px   /* section headers */
--font-size-xl    24px   /* page titles */
--font-size-2xl   32px   /* prominent balance/amount display */

--font-weight-regular  400
--font-weight-medium   500   /* emphasis, labels */
--font-weight-semibold 600   /* headings, prominent amounts */
--font-weight-bold     700   /* rare — page titles only */

--line-height-tight   1.25   /* headings */
--line-height-normal  1.5    /* body text */

--letter-spacing-tight  -0.01em   /* large amount display, for visual density */
```

**Why a dedicated `2xl` size exists specifically for amounts:** per Principle 2 (Financial Clarity), the single most important number on a screen (a balance, an expense total) is typographically distinct from every other heading size in the system — it's not reusing the page-title size, because a balance and a page title serve different visual jobs even when they're similar in scale.

---

## 4. Spacing System

4px-based scale, matching Tailwind's default scale directly (no custom override) so utility classes map predictably:
```
--space-1   4px
--space-2   8px
--space-3   12px
--space-4   16px
--space-6   24px
--space-8   32px
--space-12  48px
--space-16  64px
```
Component-internal spacing (padding within a card, gap between form fields) uses `space-2` through `space-4`; layout-level spacing (section separation, page margins) uses `space-8` and above — this distinction keeps dense financial data (expense rows, balance lists) tight and scannable while page-level structure still breathes.

---

## 5. Border Radius

```
--radius-sm    4px    /* inputs, tags, small buttons */
--radius-md    8px    /* cards, buttons */
--radius-lg    12px   /* modals, larger panels */
--radius-full  9999px /* avatars, pills (category tags, status badges) */
```

---

## 6. Shadows

```
--shadow-card      0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow-dropdown  0 4px 12px rgba(0,0,0,0.12)
--shadow-modal     0 12px 32px rgba(0,0,0,0.18)
```
Shadow intensity scales with elevation *purpose*, not arbitrarily — a card's shadow is subtle (it's part of the normal page flow); a modal's is pronounced (it must visually separate from a backgrounded, dimmed page, per Section 3 of `ACCESSIBILITY_UX.md`'s confirmation-dialog treatment).

---

## 7. Motion System

```
--duration-fast    120ms   /* hover states, button feedback */
--duration-base    200ms   /* modal open/close, tab switches */
--duration-slow    320ms   /* page-level transitions, if any */
```

**Animation principles:** motion communicates state change, never decorates — a balance updating after an expense is added animates its number change (a brief count/color transition) specifically because that's the moment the product's core value (an always-current balance) is visibly happening; a static UI element never animates without a state-change reason.

**Micro-interactions:** button press states (`--duration-fast`), form field focus rings, and the balance-update animation above are the three deliberate micro-interactions in this system — kept few and purposeful (Principle: Simplicity), not a broad library of decorative transitions.
