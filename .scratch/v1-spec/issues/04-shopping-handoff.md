# Approved list handoff and cart reconciliation

Type: grilling
Status: resolved
Resolved by: live discussion with user, November 13, 2026
Parent: ../map.md
Blocked by: 02, 05

## Answer

The planner saves a specific approved shopping list. The user manually starts the separate desktop shopping task with a reference to that saved list, without retyping ingredients. Approval applies to the exact list version; changing the plan or shopping quantities requires a newly approved version before its changes reach the cart.

The user confirmed both cart rules on November 13, 2026:

- **Update identifiable task additions.** Repeating a run must not add duplicates. A newly approved list updates earlier additions, including reductions and removals, while preserving unrelated items. If the user independently changes a shared product line and the task cannot determine which quantities it may change, ask instead of guessing.
- **Gather gaps into one review.** Complete the work that can be done, then show missing ingredients and meaningful proposed replacements together. Equivalent brands and suitable pack sizes may be selected within the approved constraints. Replacements that affect the sourced recipe or household constraints remain pending user review, not silently added as accepted changes.

### Handoff and result records

Use the brief's stable list and ingredient identities, revision, approval state/time, quantities/units and constraints. Derive the human-readable list and task input from the same saved version. Recipe requirements and confirmed stock deductions remain traceable; store product identities and pack quantities belong to the cart result rather than replacing the ingredient requirements.

Record the list version, store, pre-existing cart quantities, identifiable task additions, observed outcome, and unresolved gaps. This record supports repeat runs and explains proposed changes. After a timeout or interrupted action, inspect the current cart before retrying; an uncertain result is not proof that an addition failed. Ambiguous quantities require a user decision, consistent with the accepted rule above. Do not clear or rebuild the whole cart to avoid ambiguity.

The user reviews the resulting cart and completes checkout. These are intended behavior and data requirements, not proof that the current desktop environment can access files or control the grocery session. [Connect the browser and verify shopping context](09-browser-connection.md) subsequently confirmed browser and file access. The [preliminary cart trial](06-cart-behavior-trial.md) was deferred; actual list-to-cart correctness remains an implementation acceptance requirement.

## Question

What saved artifact and manual desktop invocation let a skill consume an approved list without retyping and reconcile repeated runs or changed plans?

Resolve item identities, revisions, quantities/units, constraints, approval invalidation, and result recording. Distinguish recipe ingredient requirements from store products. Define preservation of unrelated cart items, stale app additions, material substitutions, and minimum failure recovery. The simplest viable laptop launch is sufficient.

## Preparation for human review

**List review logic prototype** (`prototypes/PROTOTYPE-list-review.html` at commit `8de2cee88b52bc2ba5c7bf05b3f9f64386f38885`) demonstrates revision-specific approval, stale cart state, duplicate-free simulated reruns, and replacement of explicitly owned additions. **Walkthrough and limitations** (`prototypes/PROTOTYPE-list-review-walkthrough.md` at commit `8de2cee88b52bc2ba5c7bf05b3f9f64386f38885`) distinguish preparation from accepted policy.

The simulated cart knows ownership exactly and holds ingredient amounts rather than real product packs. Actual ownership detection, interrupted browser outcomes and external cart behavior remain unproven. The live discussion resolved the intended rules above; this artifact does not establish live shopping capability.
