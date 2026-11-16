# 09: Build the desktop shopping skill

**What to build:** A separately launched reusable desktop skill that reads an approved shopping list, compares available grocery baskets, prepares a reviewable cart and safely reconciles repeats or changed approvals. It returns a contract-compatible result without requiring a running planner.

**Blocked by:** 01: Define the shopping handoff contract.

**Status:** ready-for-agent

- [ ] Validate and pin one approved input using the shared contract. Use synthetic approved examples for development independently of the planner/subscription; these fixtures do not authorize real cart changes. Return results usable by ticket 08 without modifying planner internals.
- [ ] Use the supported built-in browser profile and existing delivery context. Check actual runtime availability, preserve the selected address/profile, and report missing capabilities without cookie extraction or private browser-protocol workarounds.
- [ ] Discover address-available stores, compare approximately two and prefer one complete basket. Calculate product sizes, pack counts, availability, surplus and CAD costs; include observed fees/taxes/promotion conditions and explicitly unknown charges. Claim only cheapest among checked comparable candidates.
- [ ] Apply near-need buying for perishables and explicit stock-aware decisions for long-lived/freezable items. Make material stock-up surplus and extra cash visible; low unit cost alone does not justify unwanted purchases.
- [ ] Select equivalent brands/packs within approved constraints. Complete useful work before gathering missing ingredients and material replacements into one review; recipe/constraint changes remain pending. Unresolved gaps cannot be reported as a complete cart.
- [ ] Record baseline, task additions, product/pack identities and observed outcomes. Preserve unrelated quantities, target task quantities on repeat runs, and reduce/remove identifiable stale additions for newly approved lists. Ask when independent edits make ownership ambiguous; never clear the whole cart.
- [ ] Inspect uncertain browser outcomes before retrying. Detect when an input is superseded using the available approval/run controls; stop applying the old plan when a change is known and require a newly approved input. Do not imply a background watcher exists.
- [ ] Define and test detailed basket/product records and the private reconciliation ledger here, keeping internal execution details out of the minimal app-visible result format from ticket 01. If that shared format needs to evolve, update its version/validators/examples and ticket 08 consumer together while preserving the ability to develop against synthetic results. Save validated results and the necessary private reconciliation ledger with pinned approval/run identity and digest. Preserve enough state for safe repeats; report interrupted or uncertain work honestly and keep account/cart evidence out of Git and ordinary logs.
- [ ] Verify contract and decision behavior with synthetic cart states covering pack arithmetic, incomplete comparison, normal surplus, repeats, revised reductions, unrelated items, ambiguous edits and stale results. Default regressions never mutate a real grocery cart.
- [ ] Verify real browser behavior only in an explicitly scoped supervised session using an approved list; record actual evidence/limitations separately. Leave final cart review and checkout to the user and never place an order. This is implementation acceptance, not a reinstated preliminary planning trial.
