# Draft cart behavior and comparison trial

Type: prototype
Status: resolved
Closure: deferred beyond this planning effort by user, November 13, 2026
Parent: ../map.md
Blocked by: 04, 05, 09

## Scope decision

The user chose to skip the preliminary live cart trial during wayfinding. The successful built-in browser connection and local-file check provide enough evidence to continue planning; a mock is only useful if a specific unanswered decision needs it. Do not run a replacement mock merely to complete this ticket.

Cart correctness is not proven by this closure. Validate product/pack selection, totals and unknown fees, repeat runs, changed lists, partial outcomes and unrelated cart preservation during implementation and V1 acceptance. Those are functional requirements rather than prerequisites to finishing the specification. No additional cart mutation was authorized by this deferral.

This is a scope closure, not a completed prototype. The map links it under Out of scope rather than Decisions so far.

## Original question

Can the selected desktop route support the required draft-cart behavior, and what evidence or workflow limits belong in the specification?

Prepare a human-in-the-loop five-ingredient protocol using actual address-available stores and explicit session authorization. Include pack choices, perishability, gaps, fees, reruns, revised lists, and unrelated cart items. Compare two complete baskets only after one store works. Checkout remains the user's task. If live proof is unavailable, record the blocker and obtain a decision about whether a simulated prototype is sufficient; do not claim a proven integration.
