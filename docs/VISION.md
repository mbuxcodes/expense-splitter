# Vision — Expense Splitter (Enhanced)

**Phase:** 0 — Product Discovery
**Milestone:** 0.3
**Status:** Draft
**Depends on:** PROBLEM_STATEMENT.md, USER_PERSONAS.md

---

## 1. Product Vision Statement

Expense Splitter exists so that no group — a group of travelers, a household, or a small team — has to spend its shared time on financial bookkeeping instead of on the trip, the home, or the project itself. We're working toward a future where "who owes what" is never a question anyone has to reconstruct from memory, spreadsheets, or an uncomfortable conversation — it's simply visible, correct, and current, and settling up is always the smallest number of payments the math allows. The product's long-term direction is toward being the quiet, trusted layer underneath group finances — present when needed, invisible when not.

---

## 2. Mission Statement

Every day, the product's job is to keep one thing true: that at any moment, every member of a group can see an accurate, shared answer to "where do we stand." That means recording expenses with enough fidelity to be trusted, calculating balances without error, and presenting settlement in the simplest form possible — not the most feature-rich form. The mission is accuracy and clarity first; everything else is secondary to that.

---

## 3. Product Philosophy

### Trust First
A balance is only useful if the person looking at it believes it's correct. Every design and engineering decision should make it easier for a user to understand *why* a number is what it is — not just display the number and expect faith in it.

### Simplicity Over Complexity
The product's job is to remove financial confusion, not to become a financial management platform. Every added capability should be judged against whether it makes shared expenses clearer or whether it's accounting-software scope creep wearing a group-expense-app disguise.

### Transparency By Default
A shared expense should have a single, visible source of truth that every group member can see without asking — not a private ledger owned by whoever happens to be the most organized person in the group.

### Automation Where It Matters
Calculation is a solved problem; humans doing it by hand is the actual failure mode we're fixing. The system should absorb every computation a user shouldn't have to perform themselves — split math, balance aggregation, minimum-transaction settlement — completely and correctly.

### Human-Friendly Design
Money conversations between friends, roommates, and collaborators are socially loaded even when the numbers are simple. The product should make the *numbers* the neutral party in the room, so no one has to personally advocate for what they're owed.

---

## 4. Long-Term Product Direction

Beyond its first version, Expense Splitter's direction points toward deeper *understanding*, not just recording — helping groups notice spending patterns, not just tally them. It points toward smarter defaults that reduce manual entry over time as the system learns a group's recurring patterns, and toward smoother collaboration, so a group feels like it's looking at one shared space rather than each member maintaining their own view of the same data. This is a direction, not a commitment to specific features — what stays constant is the movement from "recording what happened" toward "helping groups understand and act on it with less effort."

---

## 5. Version 1 Product Vision

Version 1 does not attempt to solve every financial problem a group might have. Its job is narrower and more disciplined: prove that the core loop — record an expense, split it correctly regardless of method, always know the current balance, and settle with the fewest possible payments — works reliably and feels trustworthy.

V1's identity: **a reliable tool for small groups to record shared expenses, always know exactly where they stand, and settle up in the simplest way possible.** Nothing in V1 exists that doesn't directly serve that identity.

---

## 6. Product Non-Goals

### Not a banking platform
**Reason:** Expense Splitter tells a group what's owed; it deliberately does not hold, move, or custody money. Becoming a banking platform introduces regulatory obligations and trust requirements that are a different business entirely, and would slow down the core promise of a fast, lightweight ledger.

### Not accounting software
**Reason:** Accounting software exists to support tax compliance, formal reporting, and audit standards for individuals or businesses. Expense Splitter's users need clarity between people who trust each other, not compliance-grade recordkeeping — conflating the two would make the product heavier and less approachable for its actual users.

### Not a payment processor
**Reason:** Facilitating the actual transfer of money (and the fraud, compliance, and liability surface that comes with it) is a distinct problem from calculating what should be transferred. Keeping these separate lets the product stay focused on being right about the numbers, and lets users choose whatever payment method they already trust to act on them.

### Not an enterprise expense management system
**Reason:** Enterprise tools solve for approval chains, cost centers, and organizational hierarchy — problems that don't exist for the peer groups this product serves. Building toward enterprise needs would add structural complexity that provides zero value to travelers, roommates, or small teams, while making the product slower and more intimidating for everyone it's actually for.

These boundaries exist to protect the product's core promise. Each excluded category is a reasonable business on its own, and each would dilute focus if absorbed into this one.

---

## 7. Product Success Definition

### User Success
- Users trust the balance shown to them without needing to independently verify it.
- Users spend meaningfully less time on expense reconciliation than they did with their previous method (notes, spreadsheets, memory).
- Users avoid the awkwardness of personally asking for money, because the system — not a person — is the one stating what's owed.

### Product Success
- Groups complete the core loop (add expense → see balance → settle) without confusion or abandonment.
- Settlement recommendations are understood at a glance, not treated as a black box to be double-checked by hand.
- Groups return to the product for their next trip, month, or project, rather than reverting to manual methods.

### Engineering Success
- Split and settlement calculations are correct in all supported modes, with no silent rounding or floating-point errors.
- Authentication and data handling meet production security standards, not tutorial-level shortcuts.
- The codebase remains maintainable enough that new features (Section 4's long-term direction) can be added without destabilizing the core calculation logic.

---

## 8. Decision-Making Framework

Before any feature is added, it should be evaluated against:

1. **Does this reduce expense-sharing friction?** If it adds a step without removing more friction elsewhere, it's not aligned with the mission.
2. **Does this improve trust or transparency?** If a feature makes the "why" behind a number harder to see, it works against the product's core philosophy.
3. **Does this support our target users?** Every feature should trace back to the Traveler, Roommate, or Team Collaborator persona — not a hypothetical future user.
4. **Does this increase complexity without enough value?** Complexity is a cost paid by every user, every time; it must be justified by a proportional reduction in the confusion the product exists to remove.

This framework exists so that feature decisions are made against a consistent standard rather than case-by-case appeal — it's what keeps the product from slowly drifting into the scope explicitly excluded in Section 6.

---

## 9. Relationship With Personas

**Traveler** — The vision's emphasis on minimal, correct settlement at a defined end point directly serves this persona's core need: a trip has a natural conclusion, and the vision's "settle with the fewest possible payments" principle is what turns a stressful last-night reconciliation into a solved problem instead of a group project.

**Roommate** — The vision's "always know exactly where they stand" principle serves this persona's core need for continuous, current visibility rather than a periodic reconciliation event — the product's job here is to make an ongoing relationship's shared costs a non-issue, not an occasional cleanup task.

**Team Collaborator** — The vision's Transparency By Default and Trust First principles serve this persona's need for a defensible, visible record — a group that needs to explain a cost later is directly served by a product philosophy that treats "why does this balance exist" as a first-class question, not an afterthought.
