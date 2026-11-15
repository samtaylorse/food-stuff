# Source-backed recipe extraction trial

Type: prototype
Status: resolved
Resolved by: user review of source-fidelity preview, November 14, 2026
Parent: ../map.md
Blocked by: 08

## Answer

The user accepted the short method's level of detail for V1. Its primary purpose is to provide a quick understanding of a sourced recipe when deciding what to cook; the original recipe will usually be used for cooking initially. Present the preview as brief bullet points rather than a paragraph, and keep the original source easy to open. This is not a request for a standalone cooking mode.

The trial establishes retrieved source metadata, concrete extraction requirements and an accepted display approach using manually normalized examples. It does not establish a complete automated importer, AI normalization reliability, cooking correctness or publisher reuse permission. Those limits remain explicit implementation considerations rather than claims of completed validation.

## Captured trial evidence

Captured locally on `prototype/recipe-fidelity`, accepted bullet-list revision `a1dcc105ebfb91bc41aa31c6b405cefebe2f60b3`; the initial comparison remains at `2be3e85158854b679f098c424dbd64c84aa02d2c`:

- `prototypes/PROTOTYPE-recipe-fidelity.html`: self-contained preview of two source-linked records, portion scaling and incomplete-source rejection.
- `prototypes/RECIPE_FIDELITY_FINDINGS.md`: observations, concrete importer requirements, scope and checks. Full raw source responses remain outside the repository.

Ordinary HTTP retrieval succeeded for the selected Good Food chilli and RecipeTin Eats lentil soup examples. Their structured fields had 16/15 ingredient lines, 16/7 instruction items, and different yield/author shapes. The chilli's structured data omits separate prep/cook times and leaves 300 ml water in the method rather than its ingredient array. The soup has equivalent cup/gram measurements for the same dry lentils. These are direct observations, not a site-wide reliability result.

The prototype uses manually normalized snapshots and concise methods, checked against observed source fields. It does not implement or prove AI normalization, a full importer, or publisher permission. Source notes and method-only ingredients must be included in the extraction design; raw structured-data arrays alone are insufficient. Net versus drained and dry versus cooked quantities retain their meaning. Cooking times are not scaled as ingredient quantities are.

Checks passed for source-yield and line-count agreement, scaling four portions to six (including method-only water), equivalent measures counted once, immutable base snapshots, incomplete-source rejection and minimal-DOM rendering. The user reviewed the display and accepted its high-level detail with the bullet-list change. The ticket is resolved by that live review and the recorded evidence, not by assuming scripted checks prove an automated importer.

## Question

Can the selected discovery and retrieval route produce a faithful, reusable local recipe record and concise display from Good Food and RecipeTin Eats without inventing details?

Use a small disposable extraction/display example, not a production importer. Compare at least one original recipe per selected site against its extracted ingredient quantities, method-only ingredients, preparation details, yield, optional extras, times, concise steps, and attribution. Demonstrate scaling from the saved base record and rejecting incomplete results rather than completing them from memory. Obtain the user's reaction to the retained/displayed cooking information.

Consult [recipe discovery evidence](01-recipe-discovery.md) for actual HTTP observations and each publisher's stated constraints. Record the applicable access and content-use conditions for the proposed private local behavior; do not present unresolved scope as licensed use or bypass blocked sources. If those constraints prevent the proposed route, return the concrete problem to the user rather than silently changing sources or reducing the product to links only.

This trial must distinguish hosted discovery, original-page retrieval, faithful extraction, saved reuse, and display. A successful search or a Recipe JSON-LD count alone does not establish the full chain. Keep throwaway code outside main and link the captured branch here.
