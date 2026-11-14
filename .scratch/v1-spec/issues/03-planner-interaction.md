# Planner proposal and review interaction

Type: prototype
Status: resolved
Resolved by: user review, November 12, 2026
Parent: ../map.md
Blocked by: 01, 02, 08

## Answer

The user accepted the demo for high-level alignment on the flow on November 12, 2026. Visual polish remains for later; acceptance does not mean every fixture, parser shortcut, or simulated integration is production-ready.

The agreed sequence is independent meal recommendations, plain recipe-extras checkboxes, optional photo-first stock capture with text as a fallback, correction of extracted stock when supplied, a simple editable shopping list with covered items hidden/recoverable, and a covered-first approval comparison. Searchable ingredient detail can live outside the main list; the side panel demonstrates one approach.

The review should additionally draw attention to easy-to-miss stock and purchase discrepancies, including unreported stock and unexpectedly low or high purchase quantities. These are contextual review cues, not automatic evidence that stock is absent or a purchase is wrong. Exact comparison rules and presentation are tracked in [Review attention flags](11-review-attention-flags.md).

## Captured prototype evidence

- Artifact: `prototypes/PROTOTYPE-planner-flow.html` on `prototype/planner-flow`.
- Walkthrough and limitations: `prototypes/PROTOTYPE-planner-flow-notes.md` on the same branch.
- Latest artifact captured locally on `prototype/planner-flow`, commit `b6ad0059866745bc3c6e7ef6385a6c76bb8720a7`; previous revisions remain at `f972185273bec4303104df73210e1b748854ba51` and `65ddc34ab5a8e734c905c44efb8e88a4ffdcdf38`. No prototype version was pushed or merged. If the temporary worktree disappears, recover the desired commit in a separate worktree.
- Current flow: meals → plain recipe-extras checkboxes → optional photo-first stock capture → stock corrections when applicable → shopping list with hidden covered items → covered-first approval comparison. Purchase amount editing has a fixed-size field, and searchable details open in a side panel.
- The parent stopped the worker when preparation exceeded the small scope's expected time, then reviewed and finished its draft directly. Kept unquantified seasoning requirements separate from measured quantities to avoid a false unit aggregation.
- Script parsing and minimal-DOM checks passed for the current flow, empty-input Continue, show/hide covered items, purchase edits, approval groups/tags, searchable details and invalidation. Actual browser layout and click-through are not verified. AI, source discovery, photos, saving, and cart operations are simulated, not integrated.
- The user's reviews below drove the revisions; the latest artifact was accepted for high-level flow alignment. Do not infer acceptance of every prototype shortcut or data detail. The requested review flags are recorded for later work and are not implemented in this artifact.

## User feedback on the first demo

- Keep two initial recommendations. Each meal needs a quick way to browse another recommendation independently, preserving the other meal.
- Give each part of the flow one clear job: meals, extras, stock capture, extracted-stock corrections, shopping list, and compact final approval.
- Extras must distinguish a source recipe's serving suggestion from an app suggestion and from the app's include/omit recommendation. Confirm extras in their own step before stock.
- Stock capture accepts photos or a description, then shows the extracted list for correction before deriving shopping quantities.
- Shopping is a simple item-and-quantity list. Check off an ingredient already on hand, keeping it visible but dimmed, and edit purchase quantity when needed. Avoid a row of controls for every ingredient.
- Calculation bases and other detail belong behind expansion. Remove the mixed-unit teaching example and always-visible debugging/guided controls from the normal flow.
- Final approval is brief, like confirming a cart, rather than another dense review of the same list. Back navigation provides access to the editable list.
- This first feedback round was superseded in part by the next round and informed the final accepted flow.

## User feedback on the revised demo

- Remove directive copy where the controls themselves make the action clear, including Keep this or keep looking and the provenance explainer section.
- Simplify extras to the optional items and sides actually mentioned by each recipe, with a checkbox. Defer app-generated extra suggestions and include/omit recommendations; no per-item provenance labels are needed when the list only contains recipe extras. This supersedes the earlier recommendation/provenance presentation.
- Make photos the main stock input. Put text description behind a secondary option. A single Continue action accepts no input and proceeds to shopping; no separate skip button or empty-input block.
- Hide covered shopping rows by default, with a clear way to show and uncheck them. Make purchase-amount editing stable in size.
- Keep ingredient, recipe and stock detail accessible and searchable. The side-panel pattern is being tried in the prototype; the user did not mandate that exact layout.
- Replace the sparse approval summary with a comparison table: ingredient, recipe-required amount, and amount to buy. Group covered ingredients first, then purchases. Compact recipe tags are a useful enhancement if clean.
- These instructions supersede the earlier always-visible covered rows and summary-only approval. The resulting revision was accepted for high-level flow alignment, with review flags added as a follow-up.

## Question

What minimal phone-friendly and laptop-friendly flow lets the user revise sourced meals, confirm relevant stock, and approve a list with little effort?

Prepare a disposable outline or mockup with concrete source references and quantities, then obtain the user's reaction. Explore expandable recipes, attribution, photo observations, focused confirmations, unchanged meals, and review after revisions invalidate approval. Sharing original recipe links covers the partner's V1 use. Preparation may happen unattended; acceptance requires the user.
