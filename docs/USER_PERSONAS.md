# User Personas — Expense Splitter (Enhanced)

**Phase:** 0 — Product Discovery
**Milestone:** 0.2
**Status:** Draft
**Depends on:** PROBLEM_STATEMENT.md

---

## 1. Persona: The Traveler — "Bounded Group, Hard Deadline"

### Background
Adults in their mid-20s to late-30s, traveling with a group of friends or extended family 1–4 times a year — a weekend trip, a week-long vacation, occasionally a longer international trip. They're not managing expenses professionally; this is a side task layered on top of actually enjoying the trip. The problem is intermittent (a few times a year) but intense when it happens, and the group composition changes trip to trip.

### Scenario
A five-day trip with five people. Flights are booked individually (no shared expense there), but from arrival onward: one person pays for the Airbnb upfront, another covers a group dinner, a third pays for a rental car that only three of the five are using, and cash is split unevenly for a group activity because two people opted out. By day three, nobody has a clear picture of the running total — expenses were paid by four different people, for subsets of the group that aren't all the same five, using a mix of cash and cards.

### Goals
- Enjoy the trip without a background hum of "I should track that" anxiety.
- Trust that whatever they end up owing (or are owed) is actually correct.
- Settle up once, quickly, at the end — not through a week of ongoing IOUs.

### Pain Points
- Multiple payers for overlapping-but-not-identical subsets of the group (not every expense includes everyone).
- Expenses are forgotten or under-remembered by the time anyone sits down to reconcile — receipts aren't kept, cash payments aren't logged anywhere.
- Splits aren't uniformly equal — some expenses need to exclude specific people, which manual methods handle poorly.
- The reconciliation moment itself (usually the last night or right after the trip) is stressful precisely because it's high-stakes and time-boxed — nobody wants to relitigate three days later whether the taxi included Sara.

### Current Solutions
A running group chat message thread ("I paid for the Airbnb, $340"), occasionally a shared notes file, and for the actual math — mental estimation or one person volunteering to "figure it out" with a calculator at the end. Errors are common and rarely caught, because there's no independent record to check against.

### Product Needs
- Fast expense entry, ideally during or immediately after the moment of payment (not batched at the end).
- Support for splits that exclude specific members, not just even splits.
- A settlement view usable at the trip's end that produces the minimum number of payments — this persona is the primary justification for the settlement algorithm being a core feature, not a nice-to-have.

---

## 2. Persona: The Roommate — "Unbounded Group, Continuous Balance"

### Background
Someone sharing a lease or household with 1–4 others, for a period measured in months to years, not days. Unlike the traveler, this isn't an occasional event — it's a standing arrangement with expenses recurring on a monthly cycle (rent, utilities) plus irregular shared costs (groceries, household supplies) layered on top.

### Scenario
Rent is split evenly among three roommates, but utilities fluctuate month to month and are usually paid by whoever's name is on the account, to be reimbursed by the others. Groceries are bought inconsistently — sometimes one person does a full shop, sometimes it's split at checkout. Over a few months, small unreconciled amounts from groceries start to blend into the larger, more visible utility and rent payments, and nobody has a clean answer to "who actually owes what right now."

### Goals
- Know their current balance at a glance, at any time — not just when someone initiates a reconciliation.
- Avoid the awkwardness of bringing up small debts directly, especially with someone they live with and see daily.
- Trust that recurring expenses (rent, utilities) are being split consistently without re-litigating the split every month.

### Pain Points
- Recurring expenses with varying amounts (utility bills aren't fixed) make "just copy last month" unreliable.
- Small debts accumulate silently — a $12 grocery imbalance feels too minor to bring up on its own, but several of them compound into a real amount over months.
- Because the relationship is ongoing and daily, there's no natural "settle-up moment" the way a trip has an end date — without a tool prompting it, balances can go unaddressed indefinitely.
- Lack of a shared, visible record means disputes default to memory ("I'm pretty sure I paid for internet last month"), which is a bad foundation for a relationship you're in daily.

### Product Needs
- Always-current balance visibility per member, independent of a triggered "settle up" action — this persona is the primary justification for treating balance calculation as a live, queryable state rather than a batch computation.
- Expense history that's easy to scan by category (rent vs. utilities vs. groceries) to make patterns visible over time.
- Low-friction entry for small, frequent expenses, since the persona's pain comes from many small transactions rather than a few large ones.

---

## 3. Persona: The Team Collaborator — "Accountable Group, Provenance Matters"

### Background
A member of a small team — a startup, a freelance collaboration, or a project group — sharing costs tied to a shared goal rather than a shared living space or trip: software subscriptions, client-related expenses, shared equipment or tools. Group size and membership can shift as the project evolves (someone joins mid-project, a freelancer's engagement ends).

### Scenario
The team pays for a shared design tool subscription, a co-working space day pass for a client meeting, and a one-off purchase of equipment needed for a deliverable. Different team members pay for different things, and later — when reviewing project costs or when a member who didn't approve a purchase asks about it — the team needs to be able to answer not just "what do I owe" but "what was this for, and who signed off on it."

### Goals
- Transparency: every team member can see what was spent, by whom, and why, without asking.
- Accountability: spending is traceable to a decision, not just a number.
- Confidence that the record is accurate enough to reference later — potentially in a client conversation or project retrospective.

### Pain Points
- No clear record of *why* an expense happened, only that it did — a bare "who owes whom" number is insufficient when the underlying justification matters.
- Ambiguity over expense ownership when purchases are made on behalf of the team rather than benefiting one person directly.
- Team composition changes mid-project; a member leaving shouldn't erase or corrupt the historical record of expenses they were part of.

### Product Needs
- Expense records that persist meaningfully even as group membership changes — this persona is the primary justification for treating expense history as an append-only record rather than something that gets rewritten when membership changes.
- Descriptive, categorized expense entries (not just amounts) so the "why" is preserved alongside the "how much."
- Group management that handles membership changes without breaking historical balance or expense data.

---

## 4. Persona Comparison Matrix

| Persona | Main Use Case | Expense Frequency | Group Duration | Main Pain | Important Features |
|---|---|---|---|---|---|
| Traveler | Trip cost splitting | High, bursty (concentrated over days) | Short, bounded (days–weeks) | End-of-trip reconciliation stress; uneven/excluding splits | Minimum-transaction settlement; flexible split-by-subset |
| Roommate | Household cost sharing | Recurring, ongoing | Long, unbounded (months–years) | Silent accumulation of small debts; no clear "now" balance | Always-current balances; recurring expense handling |
| Team Collaborator | Project/shared-tool costs | Moderate, irregular | Medium, project-bound | Lack of provenance/audit trail; membership churn | Expense history with context; resilient group membership |

---

## 5. Shared User Needs

Despite different usage shapes, all three personas converge on the same underlying needs:

- **Trust** — every persona needs confidence that the numbers are correct without personally re-verifying the math; this is the whole reason a tool is preferable to memory or ad-hoc methods.
- **Transparency** — a visible, shared record that all parties can independently check, rather than one person's private tally.
- **Accuracy** — correct handling of splits (even, uneven, percentage) and no silent rounding errors, since small persistent errors are exactly what erodes trust over time.
- **Low friction at the moment of entry** — every persona's current workaround fails partly because logging an expense is *more effort than skipping it*; the product needs entry to be fast enough that it actually happens in the moment.
- **Clarity without confrontation** — all three personas describe discomfort in raising money issues directly; a neutral, shared source of truth removes the need for an awkward conversation to simply be the one asking.

---

## 6. Persona Influence on Product Decisions

**Features**
- Traveler → drives the minimum-transaction settlement algorithm and support for splits that exclude specific members.
- Roommate → drives recurring-expense handling and category-based expense history.
- Team Collaborator → drives descriptive/categorized expense entries and group-membership-change handling that preserves history.

**UX**
- Traveler → a clear, prominent "settle up" flow usable at a defined end point.
- Roommate → balances need to be visible on first load, without navigating into a separate "reconcile" action — this persona is why balance visibility is a default view, not a triggered one.
- Team Collaborator → expense detail views need room for context (description, category) beyond just amount and payer.

**Architecture**
- Traveler → the settlement algorithm needs to run efficiently against a group's full current balance state on demand.
- Roommate → balance calculation needs to be efficient as a live/near-real-time read, since it's the default view rather than an occasional one.
- Team Collaborator → the data model needs expense records to remain valid and attributable even after a referenced member leaves a group (soft-removal rather than hard deletion of membership, and expenses that retain payer/split references independent of current membership).

---

## 7. Out of Scope Persona Needs

- **Enterprise finance teams** — needs like multi-level approval workflows, budget caps, and integration with corporate accounting systems represent a different product with different compliance requirements; none of the three core personas need this, and building for it would dilute focus on the actual target usage patterns.
- **Large corporations** — expense volume, user counts, and organizational hierarchy at that scale require infrastructure and permissioning models (departments, cost centers, managerial approval chains) well beyond what a peer-to-peer group-splitting tool is designed for.
- **Professional accounting users** — needs like tax categorization, invoicing, and formal financial reporting belong to accounting software, not an expense-splitting tool; including them would blur the product's actual value proposition (fast, low-friction group settlement) with a different one (financial record-keeping for compliance purposes).

These are excluded because none of the three primary personas represent this usage pattern — including them now would mean designing for hypothetical users at the expense of the real ones already defined.
