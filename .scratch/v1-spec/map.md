# Food Stuff V1 implementation specification

Type: map
Label: wayfinder:map
Status: open

## Destination

An implementation-ready V1 specification for the local dinner planner and its separately launched desktop grocery-cart workflow, with the major product, data, and integration decisions resolved.

## Notes

- Planning effort: resolve decisions and gather evidence; production implementation follows separately.
- Baseline: [project brief](../../docs/PROJECT_BRIEF.md) and [subscription access findings](../../docs/SUBSCRIPTION_PROTOTYPE_FINDINGS.md). Preserve the prototype stash.
- The user confirmed the destination and frontier. Discover recipes as needed across a few selected websites, not a fixed catalog. Every displayed recipe needs a verified source; V1 excludes generated recipes and invented variations.
- Sharing original recipe links covers the partner's V1 use. Separate partner access is deferred.
- Follow the local tracker. Ticket Type values correspond to wayfinder labels, not triage roles. Claim before working; record `## Answer`, set `Status: resolved`, and add a named summary link here when finished.
- Read grilling and domain-modeling for human decisions, prototype for prototype tickets, and research for research tickets. Consult `docs/agents/domain.md` before exploring.
- Research agents use GPT-6.1 Sol with Medium reasoning until the user changes this preference. Findings live on isolated `research/*` branches, pushed without PRs and never merged; this map links their evidence.
- The user authorized unattended research and prototype preparation overnight. Human decisions and prototype acceptance remain open for the next live discussion.
- Subscription inference, web retrieval, local files, and desktop browser control are separate boundaries to investigate. The access proof does not establish all of them.
- Overnight work must not change signed-in carts, expose credentials, or purchase. Prepare a live trial protocol and identify authorization/setup needed for a later interactive trial.

## Decisions so far

<!-- One named link and gist per resolved ticket; answers belong in tickets. -->

- [Recipe discovery and retrieval](issues/01-recipe-discovery.md): domain-filtered web search completed through the existing Plus grant and two original pages exposed Recipe JSON-LD; full-pipeline validation remains open.
- [Desktop cart capabilities and trial prerequisites](issues/05-desktop-cart-capabilities.md): initial research identified missing runtime exposure and the need to verify a working browser connection; the later connection check is recorded separately.
- [Ingredient quantities and pantry confirmation](issues/02-ingredient-quantities.md): simple stock choices, confirmed mixed-unit estimates, user-selected optional extras, visible seasoning assumptions, and lower-bound yield scaling reduce measurement friction.
- [Source selection and recipe display policy](issues/08-source-selection.md): begin with Good Food and RecipeTin Eats, retry unusable candidates automatically, and retain local cooking information with attribution for consistent reuse.
- [Planner proposal and review interaction](issues/03-planner-interaction.md): the user accepted the focused flow from meals through covered-first approval; UI polish is deferred and targeted review flags remain to define.
- [Approved list handoff and cart reconciliation](issues/04-shopping-handoff.md): consume a saved approved version, update identifiable task additions without duplicates, preserve unrelated cart items, and gather gaps or meaningful replacements into one review.
- [Connect the browser and verify shopping context](issues/09-browser-connection.md): a fresh Terra chat opened its own built-in browser pane, verified the signed-in delivery context and grocery options, and read a local handoff fixture; no cart changes were made.

## Not yet specified

- Source-specific extraction and ingredient edge cases may emerge from sample recipes.
- Browser failure recovery and partial-basket review details may need additional focused decisions after the first workflow discussion.
- Exact implementation slices depend on the decisions below; this map does not preassign build tasks.

## Out of scope

- [Draft cart behavior and comparison trial](issues/06-cart-behavior-trial.md): the user deferred this preliminary trial; test cart correctness during implementation instead of blocking the specification or creating an unnecessary mock.
- Production app implementation during this planning effort.
- Reopening settled defaults or adding settings UI, custom voice, generated recipes, separate partner accounts, public hosting, continuous inventory, multiple AI providers, or automatic checkout.
- Universal cheapest-price claims, arbitrary web coverage, and multi-store checkout optimization.
