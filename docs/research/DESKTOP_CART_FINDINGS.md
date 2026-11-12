# Desktop cart findings

Date: November 11, 2026. Research only; no website session, account, product, price, cart, or checkout was inspected or changed.

## Recommendation

Use a separately invoked **local desktop browser task** with the browser/profile in which the user is signed into Uber Eats. Prefer the connected regular-browser extension for an existing session; use the built-in browser only if the user deliberately signs into its separate profile. Do not embed desktop automation in the planner's subscription inference request.

**No executable browser-control route is currently exposed in this research chat.** The installed Windows Computer Use instructions are real, but their required execution tool is absent. This is a setup/tool boundary, not evidence that Uber Eats cannot be automated. The first trial must prove browser connection and signed-in address context before attempting the shopping workflow.

The brief requires two address-available stores, a complete single-store basket by default, pack arithmetic, preserved unrelated items, revision reconciliation, and a reviewable cart with user checkout. Those requirements remain unproven. Public store listings cannot establish address-specific availability, account prices, promotions, or delivered basket totals; those require the selected delivery context in the live session. [Project brief](../PROJECT_BRIEF.md#store-comparison-and-cart-requirements)

## Evidence and confidence

| Finding | Status | Evidence and limit |
| --- | --- | --- |
| This isolated worktree is on `research/desktop-cart`; it began clean. | Locally checked | `git status --short --branch`, November 11. Canonical main checkout was not modified. |
| Windows Computer Use is installed and documents `node_repl` importing `@oai/sky`. | Local documentation read | [Installed SKILL.md](C:/Users/95sam/.codex/plugins/cache/openai-bundled/computer-use/26.1106.51428/skills/computer-use/SKILL.md); [guidance](C:/Users/95sam/.codex/plugins/cache/openai-bundled/computer-use/26.1106.51428/docs/guidance.md). No import or app discovery was attempted. |
| Current callable tool metadata has no `node_repl`, browser/Chrome automation, Playwright, or `sky` tool. | Locally checked metadata | Filtered the complete `ALL_TOOLS` tool-name inventory for `node_repl\|browser\|computer\|chrome\|playwright\|sky`; zero matching names at the final check. Description inspection found `mcp__codex_app__open_in_codex`, but it only opens panels and says separate tools must inspect/interact. Web search retrieves public information; it does not provide the user's session. Tool exposure can change in a later chat. |
| A cached Chrome skill exists under a backup directory, not among this chat's available skills. | Local documentation/path check | [Backup Chrome SKILL.md](C:/Users/95sam/.codex/plugins/cache/openai-bundled/plugin-backup-7SIU3X/chrome/26.608.12217/skills/control-chrome/SKILL.md) requires `mcp__node_repl__js` and an absolute `scripts/browser-client.mjs` import. `Test-Path` for that script in this backup plugin root returned `False`. Do not bootstrap from this backup or treat it as an installed connection. |
| A connected regular-browser extension can act in an existing signed-in profile. | Officially documented, not tested here | [Browser extension](https://learn.chatgpt.com/docs/chrome-extension), setup and start-task sections. Availability depends on rollout/workspace configuration. |
| Desktop built-in browser and cloud Work browser are distinct from the regular browser session. | Officially documented, not tested here | [Browser](https://learn.chatgpt.com/docs/browser), desktop profile and cloud browser sections. A local session cannot be assumed to transfer. |
| Subscription-backed local text/image/change requests worked for this account/model. | Previously tested, not rerun | [Subscription findings](../SUBSCRIPTION_PROTOTYPE_FINDINGS.md). This proves inference access only. |
| Planner plan usage does not supply native hosted computer use. | Officially documented | [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations), unsupported tools. A separate desktop task needs its own execution tools and permissions. |
| Uber Eats login, selected delivery address, store availability, product listings, fees, and cart behavior. | Unverified | No signed-in browser actions were authorized for this research. Walmart, Real Canadian Superstore, and Costco are user candidate context, not a verified support matrix. |

The tool inventory above is an observation of this delegated research session, not a universal claim about the user's desktop or another chat. No cookies, profiles, tokens, credentials, session stores, or private shopping information were examined. The initial shell call inherited an invalid working directory; specifying the assigned worktree resolved it. That shell issue says nothing about browser capability.

## Exact minimal route and missing setup

1. On the user's laptop, use the desktop app's **Settings > Computer Use**, choose the browser containing the Uber Eats session, follow its required plugin/extension setup, and verify that it shows **Manage**. Use the same browser profile. Start a local Codex or ChatGPT Work chat and mention the browser, for example `@Chrome`. These are documented setup steps, not steps performed here. [Official browser-extension setup](https://learn.chatgpt.com/docs/chrome-extension#set-up-the-chrome-extension)
2. In that chat, establish that the actual browser control tools are exposed and connect successfully. Re-read that active browser skill and its confirmation policy; do not substitute a shell-driven browser, raw CDP, cookie extraction, or the incomplete backup plugin. Connection failure is a blocker to report, not a reason to install an improvised automation stack.
3. Perform a narrow read-only observation: find the intended Uber Eats tab, verify that it is signed in, confirm the displayed delivery context with the user, inspect the available stores and existing carts. Do not publish the precise address in research or Git. If login, permissions, CAPTCHA, or a locked desktop blocks work, let the user handle the required step under the active tool's policy.
4. Consume the saved approved list from the local Food Stuff project using ordinary local file access in the **same local task**, then use the browser for store interaction. A pathname alone is not proof that a different Work/cloud environment can read the file. If local file tools are absent, attach the saved artifact to that chat or provide the local app's read-only approved-list view and verify its revision. Never silently fall back to manually retyped ingredients or upload the entire list to Uber Eats.
5. Compare two available stores, present evidence and unresolved decisions, then construct/reconcile the selected cart within the authorized scope. Keep the final cart page open for human review and stop before checkout.

The installed Windows Computer Use route is a secondary possibility **only after its required runtime becomes available**. Its guidance prefers Browser Use for browser automation; it requires observed app/window selection and fresh state between actions, and prohibits automating authentication dialogs or the Codex/ChatGPT app itself. [Windows guidance](C:/Users/95sam/.codex/plugins/cache/openai-bundled/computer-use/26.1106.51428/docs/guidance.md) Its [confirmation policy](C:/Users/95sam/.codex/plugins/cache/openai-bundled/computer-use/26.1106.51428/docs/confirmations.md) also applies to allowed Windows UI actions. Setup permissions must be handled by the user, not automated through the desktop app.

`@Browser` is a documented alternative for a deliberately signed-in built-in profile, and supports Codex/Work desktop page interaction. It does not inherit the regular browser profile. Cloud Work/agent browsing uses its own computer and sessions; a local filesystem, localhost app, and local login must not be assumed available there. [Official browser documentation](https://learn.chatgpt.com/docs/browser) Native Responses computer-use integration would be a separate driver/API project; it is outside the selected route. Direct Uber early-access API applications are also outside this research scope. [Project integration context](../PROJECT_BRIEF.md#external-integration-context)

## Handoff contract to prepare

This is a proposed contract, not an implemented file format or approved live shopping list. Save one revision atomically, with a human-readable view generated from the same data:

- `list_id`, `revision`, explicit approval state/time, and a content digest; approval must cover the exact saved revision.
- Stable ingredient IDs, names, required quantities and canonical units, confirmed stock deduction and final quantity to buy, product/dietary constraints, accepted substitutions, and surplus preferences. Unresolved unit/quantity questions block approval.
- Store candidate limit (two), CAD, selected address context acknowledged in the live session, and instruction to stop before checkout. Avoid storing a full address in the artifact when the selected browser address is sufficient.
- A separate local run ledger: run ID, approved revision/digest, observed store identifier/link, time checked, baseline cart quantities, selected product/size, required packs, owned quantity delta, observed resulting cart, failures and review decisions. Do not put account/cart evidence or screenshots in tracked Git by default.

Before using a file, read it once, validate required fields, confirm approved status, and pin its revision/digest. If it changes during the run, stop and reconcile against newly approved data; an updated plan is not automatically an approved shopping list. This follows the [brief's approval and consistency requirements](../PROJECT_BRIEF.md#preferences-saved-state-and-consistency).

Minimal future invocation, after setup and explicit trial authorization:

> @Chrome Use the already signed-in Uber Eats tab and the approved Food Stuff shopping-list artifact at [absolute local path], list [ID], revision [N]. Verify the saved approval and show the revision you loaded. Use the selected delivery address without changing it. Inspect existing carts first. Compare five approved ingredients at two stores actually available for that address, starting with Walmart and Superstore if listed; otherwise report the available candidates. Match constraints, calculate pack counts, record surplus and visible CAD charges, and flag missing items or substitutions. Preserve unrelated items. Propose the better complete basket among the checked candidates, then reconcile only this run's authorized additions in the selected store's cart. Re-observe after uncertain outcomes. Leave the resulting cart open, report changes/gaps and fee uncertainty, and stop before checkout. Do not purchase or place an order.

An invocation authorizes only its stated trial scope. The active browser tool may impose action-time confirmation; resolve that against the actual user's authorization and active policy when the concrete action is known. Today's research authorization does not authorize account/cart actions.

## Five-ingredient dry run

**Invented quantities and pack sizes for arithmetic illustration only. These are not live products, prices, availability, recipe requirements, or an approved list.** Use an actual approved five-item list tomorrow. Choose a mix that exercises count, mass, pantry deduction, perishable surplus, and a long-lived staple.

| Ingredient | Recipe total / confirmed stock | Buy need | Hypothetical store A pack | Packs and surplus | Hypothetical store B pack | Packs and surplus |
| --- | --- | --- | --- | --- | --- | --- |
| Boneless chicken | 1,200 g / 300 g | 900 g | 500 g | 2; 100 g extra | 1,000 g | 1; 100 g extra |
| Dry rice | 700 g / 200 g | 500 g | 900 g | 1; 400 g extra | 2,000 g | 1; 1,500 g extra |
| Broccoli | 600 g / 0 confirmed | 600 g | 300 g bag | 2; 0 extra | 500 g bag | 2; 400 g extra |
| Canned tomatoes | 800 g / 0 confirmed | 800 g | 400 g | 2; 0 extra | 796 g | 2; 792 g extra |
| Eggs | 8 eggs / 2 eggs | 6 eggs | 6 eggs | 1; 0 extra | 12 eggs | 1; 6 extra |

For compatible fixed units, `need = max(0, recipe_total - confirmed_stock)`; `packs = ceil(need / pack_quantity)`; `surplus = packs * pack_quantity - need`. Calculate `line_cost = packs * observed_pack_price`. Do not equate drained weight with net weight or convert cans, heads, mL, and grams without a justified conversion. If tomatoes only show mL, resolve the actual requirement rather than assuming density. Variable-weight meat/produce requires the displayed weight basis and an estimate/range until the actual weight is known. A whole broccoli head is not automatically a 300 g bag equivalent.

A slightly smaller 796 g can does not satisfy an 800 g need. Propose two cans with surplus, another suitable product, or deliberate scaling of the whole sourced recipe with a recomputed list and renewed approval; do not invent an ingredient variation or quietly round down. Rice's larger pack may suit the household's long-lived-stock preference, but still disclose extra cash and excess. Broccoli surplus should weigh against the stated perishable preference. Meat stock-up is acceptable context, not unlimited permission. [Buying defaults](../PROJECT_BRIEF.md#pantry-and-buying-rules)

## Two-store comparison and review evidence

Build a comparison worksheet in local run output before deciding. Each store gets the same five needs, acceptable product constraints, and confirmed-stock deductions. Record product links/names, pack size and unit, pack count, line cost, availability and observation time. Distinguish ingredient completeness from price: a four-item basket cannot win against a complete five-item basket without clearly identifying the gap and unresolved cost.

For each store report: item subtotal; delivery and service fees; taxes/deposits/bag charges if visible; promotions with eligibility conditions; tip if selected; and displayed total if available. Leave each unobserved component explicitly **unknown**, never zero. Show separately any variable-weight range or minimum-order issue. A provisional item-price comparison may be useful, but cannot establish the cheaper delivered total when fees remain unknown. Existing unrelated items can change fees/promotions, so report both this list's product subtotal and the full observed cart context; do not attribute a whole-cart discount to the list without justification.

If obtaining a second store's cart/charges would replace or clear the first cart, stop before the destructive transition and explain the exact limitation. Do not assume Uber Eats supports simultaneous independent store carts or stable shareable cart links. Prefer non-mutating product comparison; if cart staging is required, establish the supported cart behavior and authorization first. The final claim should be **cheapest among these checked complete candidates at this time**, qualified by unknown charges, rather than a universal price guarantee. [Comparison requirements](../PROJECT_BRIEF.md#store-comparison-and-cart-requirements)

## Reruns, revisions, and unrelated items

The baseline cart and run ledger are essential because the website does not necessarily label planner-owned lines. Example: an existing product quantity of 1 plus this run's 2 packs gives target quantity 3. Rerunning the same revision targets 3 again; it must not add 2 more. Use the actual product identity, options and pack size, not merely an ingredient name.

For a revised approved list requiring 1 planner pack, reduce 3 to 2 only if the baseline and current line still reconcile. An item removed from the new list should remove only the prior owned delta, preserving the baseline quantity. A revised recipe invalidates earlier list approval. Keep other approved ingredient additions unchanged when appropriate; do not rebuild or clear the whole cart.

If the user independently changes that shared line, the ledger is absent, the cart total is unexpected, or an action times out after submission, re-observe and treat ownership/outcome as ambiguous. Do not retry blindly, infer a failed add, delete the line, or overwrite the user's quantity. Report the conflict and ask for the narrow decision required. Maintain a before/after change summary and verify the final selected cart against the pinned revision. These reconciliation rules are proposed behavior and have not been tested against Uber Eats.

## Tomorrow's minimum live trial

- [ ] User connects the correct browser/profile and authorizes the bounded signed-in trial; actual browser tools are exposed. If unavailable, record the setup blocker and stop rather than claiming cart capability.
- [ ] Read the active skill/policy; connect and inspect the intended tab read-only. Confirm signed-in state, selected delivery context and two available stores. No precise address or credentials in Git.
- [ ] Load one genuinely approved five-item revision from the saved artifact without retyping. Validate units, constraints, stock deductions and approval; pin revision/digest.
- [ ] Capture existing-cart baseline. Price the first store's five needs with real pack arithmetic, surplus, gaps and time checked; prove all five at one store before widening.
- [ ] Compare the second available store on the same basis, recording fee uncertainty and any cart-staging limitation. Present the complete-basket choice and material substitutions for review.
- [ ] Create/reconcile only the selected authorized cart additions. Verify all five product quantities and unrelated lines. Leave checkout untouched.
- [ ] Rerun the same revision: verify no duplicate additions. With a separately approved revised list, verify one decreased/removed ingredient leaves no unexplained stale addition. Stop on ownership conflicts.
- [ ] Leave the cart page open and provide the revision, checked stores, timestamp, pack/surplus/cost table, gaps/substitutions, known/unknown charges and exact cart changes. Human reviews and checks out.

Success requires actual browser evidence for all trial steps; this report proves only documentation and local tool discovery. No software was installed, no account application submitted, and no signed-in browser action was taken.
