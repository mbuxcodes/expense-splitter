# Problem Statement — Expense Splitter (Enhanced)

**Phase:** 0 — Product Discovery
**Milestone:** 0.1
**Status:** Draft

---

## 1. Problem Overview

Shared expenses are a coordination problem disguised as a math problem. The math — dividing $100 four ways — is trivial. The coordination is not: multiple people pay for different things, at different times, in different amounts, and everyone is expected to independently remember who paid what and reconcile it fairly at some later point.

Manual tracking fails for a structural reason, not a diligence reason: it requires each participant to hold a running mental ledger that updates every time *anyone* in the group spends money, not just when they spend it themselves. That ledger has no natural checkpoint, no single source of truth, and no error-correction mechanism. A single missed or misremembered transaction propagates silently until someone finally sits down to "figure out who owes what" — usually under time pressure (end of a trip, end of a month) and usually from incomplete memory.

Settling up fails for a related but distinct reason: even when the amounts owed are known correctly, people default to settling debts pairwise, in the order they were incurred, rather than computing the minimum set of transactions that would net everyone out. This produces more payments than necessary, more friction, and more opportunities for a transaction to be forgotten or disputed.

**The fundamental problem:** there is no shared, always-current source of truth for group expenses, and no mechanism to convert a tangle of individual debts into the smallest, clearest set of payments required to make everyone even.

---

## 2. Current Situation

Absent a dedicated tool, groups converge on a small set of workaround behaviors:

- **Notes apps** — a running text list of "X paid $Y for Z." No calculation, no balance view; the group still has to do the arithmetic by hand, usually once, under pressure, at the end.
- **Spreadsheets** — better structure, but require someone to own and maintain the sheet, manually enter formulas correctly, and keep every participant's access and understanding in sync. Splits beyond "equal" (percentage, uneven) are usually hand-computed and pasted in as static numbers, which silently go stale if an expense is edited later.
- **Mental math / verbal tallying** — the default for small groups and low expense counts, and the first thing that breaks down as either number grows.

**Consequences observed across all three:**

- **Confusion** — no single person has a complete, current picture; everyone's understanding of "who owes what" is a stale snapshot from whenever they last checked.
- **Calculation errors** — uneven and percentage splits are especially error-prone by hand, and errors are rarely caught because there's no independent check against the raw expense data.
- **Relationship friction** — asking a friend or roommate for money is socially uncomfortable even when the amount is correct; when the amount is *disputed*, the friction compounds, because there's no shared record to point to.
- **Time waste** — reconciliation becomes a dedicated, disruptive task ("let's figure out the trip money") instead of a byproduct of normal use.

---

## 3. Target User Problems

### Persona 1: Travel Group
Short-lived, high-intensity usage — a handful of days with many small-to-medium expenses across multiple payers.

- Expenses are paid by whoever happens to be at the counter, not distributed evenly by plan — payer and beneficiary are frequently different people.
- Fair settlement has to happen once, at the end, from potentially dozens of transactions — by which point details ("did that taxi include Sara or not?") are already fading from memory.
- Because the group disperses afterward, there's a hard deadline for resolution and no natural second chance to correct a mistake.

### Persona 2: Roommates
Long-lived, recurring, lower-intensity but higher-stakes usage (rent, utilities, groceries) that compounds over months.

- The same categories of expense repeat monthly, but amounts vary (utility bills fluctuate), so "just split it the same as last time" isn't reliable.
- Balances need to be visible *continuously*, not reconciled once — a roommate needs to know their current standing at any point, not just at a designated settle-up moment.
- Because the relationship is ongoing (unlike a trip), unresolved small debts accumulate social cost over time even when the dollar amounts are individually minor.

### Persona 3: Small Teams
Project-based, transparency-sensitive usage — shared costs (tools, meals, travel) tied to a project or budget.

- Expenses need an audit trail, not just a balance — someone may need to justify a spend after the fact.
- Participants care about *transparency* (who approved/knew about a cost) as much as the arithmetic of splitting it.
- Team composition can change mid-project, which existing peer-to-peer splitting tools generally don't model well.

---

## 4. Existing Solution Analysis

**Splitwise**
Strong at the core recording/balance-tracking loop and has real network effects (most people's friends already have it). The recurring pain points users report: the most useful features (multiple currencies, itemized splits at scale) sit behind a paywall, the settlement suggestion doesn't always minimize transaction count in the way users expect, and the app's scope has grown broad enough that the core "add expense, see balance" flow carries more surrounding complexity than a simple group actually needs.

**Settle Up**
Positions itself as a lighter alternative with a genuinely simple entry flow, which is its main strength. Its weakness is closer to the opposite of Splitwise's: fewer advanced splitting options and thinner analytics, so groups with more complex needs (percentage splits, category-level spending analysis) outgrow it quickly.

**Manual methods (notes/spreadsheets)**
Covered in Section 2. Their core weakness isn't the tooling itself but the fact that they conflate *recording* and *computing* — every calculation is a one-off, manually triggered, and unverified against the source data.

**Common thread across all three:** none of them treat "compute the minimum number of payments to settle a group" as a first-class, always-on feature — it's either a one-time button press (Splitwise) or absent entirely (spreadsheets, Settle Up's lighter feature set). It's usually presented as an output of the tool, not a core guarantee of it.

---

## 5. Product Opportunity

**Market need:** shared-expense coordination is a recurring, well-understood problem with proven demand (Splitwise's user base is evidence the need is real), and there's daylight between "too simple" (manual methods, Settle Up's floor) and "too much" (Splitwise's breadth) for a tool that does the core loop — record, split correctly, settle minimally — well and visibly.

**Learning value:** this project touches the full range of what a production SaaS app requires — auth with token rotation, a non-trivial algorithmic core (minimum-transaction settlement), schema design under real trade-offs (embed vs. reference for frequently-recalculated data), and analytics aggregation — while staying scoped enough to actually finish.

**Technical complexity:** the settlement algorithm and multi-mode split engine (equal/unequal/percentage, each with distinct validation rules and floating-point-safety concerns) provide genuine algorithmic substance, not just CRUD-with-a-form-on-top.

**Portfolio value:** a project with a documented product-discovery phase, a defensible architecture, and an algorithm with stated time/space complexity reads as engineering judgment, not tutorial-following — which is the gap most portfolio projects fail to close.

---

## 6. Our Product Positioning

> For groups who share recurring or one-off expenses — travelers, roommates, and small teams — who struggle to keep an accurate, current picture of who owes what and end up making more payments than necessary to settle up, Expense Splitter provides a shared, always-current expense ledger with automatic minimum-transaction settlement, so the group spends its time on the trip, the household, or the project — not on reconciling money.

---

## 7. Problem Scope

### Problems we solve in Version 1
- Group creation and membership management
- Expense recording with three split modes: equal, unequal, percentage
- Always-current balance calculation per member, per group
- Minimum-transaction settlement suggestions
- Basic spending analytics (category, monthly trend, per-member contribution)
- Secure account system (register/login/logout, password reset)

### Problems we intentionally do NOT solve in Version 1
- **Banking/payment integration** — actually moving money is a separate regulatory and trust surface; v1 tells you *what* to pay, not *how* to pay it, which is consistent with how the target personas currently operate (they still hand over cash or send a peer-to-peer payment themselves).
- **Multi-currency support** — correctly handling exchange-rate timing and conversion adds real complexity for a use case (single-currency roommate/local-team groups) that covers the majority of target scenarios; international travel groups are the exception, not the default.
- **Cryptocurrency payments** — no meaningful overlap with the target personas' actual behavior; would add complexity without addressing a real observed pain point.
- **Enterprise accounting features** (invoicing, tax handling, multi-approval workflows) — the small-team persona needs transparency, not a full accounting system; that's a different product.

Excluding these isn't a permanent judgment on their value — it's a scope boundary so v1 can be built well rather than broadly.

---

## 8. Success Criteria

**User success metrics**
- A new user can create a group and add their first expense without needing instructions.
- At any point, a user can see their current balance in a group without manually reconstructing it.
- Settling a group requires the minimum number of transactions mathematically possible for that set of balances, not simply the number of debts as originally incurred.

**Technical success metrics**
- Split calculations (equal, unequal, percentage) are correct to the cent, with no floating-point drift on non-evenly-divisible amounts.
- Authentication is production-grade: hashed passwords, short-lived access tokens, rotated refresh tokens, no sensitive data exposed client-side.
- Balance and settlement calculations remain correct and performant as group size and expense count scale within realistic bounds (tens of members, hundreds of expenses per group).
