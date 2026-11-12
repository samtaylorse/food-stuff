# List review: disposable logic prototype

Question: can a person understand uncertain stock, approval of one list revision, stale cart additions, safe reruns, and material substitution review?

Open `PROTOTYPE-list-review.html` by double-clicking it. Nothing installs, saves, or connects. This is synthetic ingredient shopping data, not a recipe or a real-store integration. Proposed behaviors require human review; the existing human decision tickets remain open.

## Walkthrough

Select each tab (it resets the state), then press its ordered buttons:

1. **Uncertain stock:** initial approval is blocked by chicken, broccoli, and the missing can-to-drained-weight conversion. Example confirmations produce needs of rice 500 g, chicken 600 g, broccoli 1 count, chickpeas 240 drained g, garlic 4 cloves. Approve before reconciling.
2. **Rerun + changed list:** repeat reconciliation without duplicates. Reduce required rice from 600 g to 300 g. Approval disappears and the cart is marked stale. A new approval replaces the old 500 g rice addition with 200 g; unrelated tea remains.
3. **Material substitution:** proposing a different chicken cut blocks approval. Accepting it creates another unapproved revision. Explicit approval is still required before the simulated cart changes.

Use free play to enter known zero stock, unknown amounts, more stock than required, missing conversions, or reject a substitution. Selecting a tab or Reset returns a deterministic starting state. Free play ends the active guide.

## Human reaction needed

The final section of the HTML asks about unresolved-amount approval blocking, revision-specific approval, confirmation before replacing owned cart additions, pre-existing same-ingredient items, and separate substitution/list review. No product-policy verdict is claimed. The useful result of this preparation is a runnable way to discuss those questions.

## Verification performed

Node parsed both inline scripts, executed all three exact guided action sequences against the pure module, and initialized the rendering shell with a minimal DOM stub. Reproducible manual outcomes are listed above. Additional model checks passed for unknown/zero/surplus stock, explicit drained conversion, blocked unapproved reconciliation, deterministic reset, invalid negative input, substitution gating, unchanged reruns, replacement of stale additions, and preservation of the unrelated user item. Checked the self-contained artifact for network, storage, and external script references; none were found. No test framework or persistent test harness was added.

A real browser visual/manual click-through was not performed. The DOM-stub check verifies initialization, not actual layout, focus behavior, or browser event interaction. The file is intended for the user's own click-through.

## Scope and limitations

Cart rows are exact ingredient quantities, not purchase packs. Stable entry ownership is synthetic and fully known; this does not prove real cart detection, existing same-ingredient allocation, partial-action recovery, external modifications, pack arithmetic, substitutions at stores, pricing, availability, or browser automation. The demo has no approval timestamp because it is deterministic and in memory; a production handoff still needs durable approval metadata. No implementation is authorized by this artifact.

Capture branch: `prototype/list-review`. Keep this branch disposable; do not merge the HTML into the application.
