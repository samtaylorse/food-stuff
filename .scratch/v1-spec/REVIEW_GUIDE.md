# Resume Food Stuff wayfinding

Start with the [V1 specification map](map.md). The agreed destination is an implementation-ready specification, not production implementation.

## Research completed

- [Recipe discovery and retrieval](issues/01-recipe-discovery.md): one real domain-filtered web search completed through the existing Plus grant. Original-page HTTP checks found structured Recipe data on RecipeTin Eats and Good Food; this does not establish a complete or permission-cleared recipe importer. Evidence is on `research/recipe-discovery`.
- [Desktop cart capabilities and trial prerequisites](issues/05-desktop-cart-capabilities.md): the initial research identified the browser runtime and connection requirements. A later read-only check confirmed browser and file access; actual cart behavior remains unproven. Evidence and a five-ingredient protocol are on `research/desktop-cart`.

## Material prepared for the next live discussion

- The user deferred [Draft cart behavior and comparison trial](issues/06-cart-behavior-trial.md) beyond planning. Do not block specification work on a live cart or invent a mock without a specific decision to investigate. Cart correctness remains an implementation acceptance requirement.
- [Approved list handoff and cart reconciliation](issues/04-shopping-handoff.md) was resolved on November 13: update identifiable task additions, preserve other cart contents, ask about ambiguous user edits, and gather gaps and material replacements into one review.
- [Planner proposal and review interaction](issues/03-planner-interaction.md) was accepted for high-level flow alignment on November 12. UI polish can wait; [Review attention flags](issues/11-review-attention-flags.md) captures the follow-up request to surface likely stock and quantity oversights.
- [Ingredient quantities and pantry confirmation](issues/02-ingredient-quantities.md) was resolved in the November 12 discussion. Its answer supersedes parts of the original demo, particularly exact-amount approval blocking; the historical demo is not the current specification.
- [Source selection and recipe display policy](issues/08-source-selection.md) was resolved in the November 12 discussion: Good Food and RecipeTin Eats, automatic alternatives for unusable candidates, and local saved cooking information with attribution. [Source-backed recipe extraction trial](issues/10-source-extraction-trial.md) captures the remaining evidence and display review.
- [Connect the browser and verify shopping context](issues/09-browser-connection.md) succeeded in a fresh GPT-6.1 Terra chat on November 13 after opening the page in that chat's own built-in browser pane. Sign-in, delivery context, visible grocery options and local JSON fixture access were observed. Actual list-to-cart behavior and prices remain untested.

## Recover the prototype evidence

The accepted planner-flow study is on `prototype/planner-flow` at commit `b6ad0059866745bc3c6e7ef6385a6c76bb8720a7`. Its HTML is `prototypes/PROTOTYPE-planner-flow.html` and the companion notes are `prototypes/PROTOTYPE-planner-flow-notes.md`.

Create a separate worktree for that branch and open the HTML directly. It needs no server or installation. Keep throwaway code outside main. The earlier logic study is on `prototype/list-review` at commit `8de2cee88b52bc2ba5c7bf05b3f9f64386f38885`; its HTML is `prototypes/PROTOTYPE-list-review.html`.

The later planner-flow study establishes high-level interaction alignment. Neither prototype proves live cart behavior or a complete recipe extraction pipeline. See the named tickets for accepted decisions and superseded assumptions.

## Boundaries preserved

- The subscription-access prototype stash remains intact.
- Research and prototype code are isolated from main on their own branches; no PR or merge is required.
- No account/cart operations or purchases were performed during cart research.
- Overnight preparation did not change production code, the README, or the brief. The November 12 discussion subsequently updated the brief to reflect the confirmed pantry and quantity decisions.
- The planning records are maintained on main. Research and prototype artifacts remain isolated on their own branches; do not merge throwaway code into production. Branch and commit pointers above preserve access to the evidence.
