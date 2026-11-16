# 01: Define the shopping handoff contract

**What to build:** A versioned data format with shared validation code and automated tests that lets the planner export an approved shopping list and the desktop skill return a shopping result independently. Publish synthetic examples that both producers and consumers can validate without a running planner, subscription or grocery session.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Define approved-list and result contracts with schema versions, stable list/ingredient/run identities, revision, approval time and content digest. Define digest calculation and validation consistently; a digest detects content changes and is not proof of trusted authorization.
- [ ] Preserve purchase targets, units and measurement basis, constraints, recipe/source references, uncertain amounts, unquantified targets, covered ingredients and intentional stock-up choices without inventing precise quantities.
- [ ] Define only the initial app-visible result format: schema/run identity, exact approval identity/revision/digest, outcome status, known-cost summary with unknown charges explicit, and unresolved gaps or pending replacements. Leave detailed basket/product records and the private reconciliation ledger to ticket 09; do not require the app to understand internal skill execution state.
- [ ] Specify pinning and stale-result rules, expected failure outcomes, revision-specific atomic exports and result import. A convenience pointer cannot silently change an active run's input.
- [ ] Shared validation code and automated tests accept representative synthetic approvals/results and reject unsupported versions, malformed or altered content, missing approval evidence and mismatched identities/revisions/digests. Consumers must compare results with the current approval rather than trusting the result alone.
- [ ] Provide synthetic examples for shared ingredients, approximate stock, unquantified extras, a normal pack surplus, intentional stock-up, a minimal incomplete result, repeated run identities and a revised approval. Detailed basket/cart examples belong to ticket 09. Synthetic approval examples do not authorize real cart changes.
- [ ] Exclude credentials, browser state, account identifiers, precise delivery addresses and personal photos from committed examples and contract payloads.
- [ ] Keep the contract small and usable by ordinary application modules and a separately invoked desktop skill; no planner UI, live inference, deployment or grocery session is required to complete this ticket.
