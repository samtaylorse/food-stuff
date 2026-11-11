# Meal Planner — Project Brief

Date: November 11, 2026 · Status: agreed direction; setup only; integrations unproven.

## Purpose and users

Build a general personal meal planner, starting with dinners. Its initial household is two people in Nanaimo, BC, but household size and planning quantities are configurable, not fixed product constraints. Help users choose dinners, cook practical batch recipes, and turn the result into an accurate grocery list and a reviewable delivery cart. Reduce the weekly work of deciding, calculating quantities, checking stock, comparing stores, and entering products. Lunches already have a separate plan for the initial household and are outside V1.

The initial household normally cooks twice, sometimes three times per week. Food choices stay open unless the user specifies a preference. The tool should start with a complete usable proposal rather than requiring a planning interview.

## Configuration and default week

- Keep household size, batch recipe count per week, and individual portions per recipe as distinct internal configuration values in the proof of concept. Initial defaults are 2 people, 2 batch recipes per week, and 6 individual portions per recipe.
- Under those defaults, each recipe covers three dinners for the household: twelve individual portions cover six household dinners, leaving one evening flexible.
- Derive coverage from the active configuration and actual recipe yields, rather than hardcoding six dinners or one flexible evening. For each recipe, divide individual portions by household size to report complete household dinners and any leftover individual portions; do not silently round partial coverage into a full dinner. Report weekly coverage and any uncovered evenings or surplus explicitly.
- Recipes remain flexible; do not assign them to particular days. Permit changes to recipe count, servings, or approach when requested.
- Each recipe includes a concise ingredient list with quantities and units, explicit servings, clear cooking steps, and estimated prep and cook times. Published recipes or external recipe links are unnecessary.

Centralize these values in a simple internal configuration structure. Planning, portion scaling, coverage calculation, and shopping-list quantities must use the same values. No settings UI or settings framework is needed in the proof of concept. A future web settings UI should be able to expose the same values without rewriting that logic. This setup task adds documentation only, not runtime configuration code.

## V1 experience

1. Start a week using the active configuration, explicitly saved household preferences, and any temporary requests. Show the configured number of complete proposed recipes (initially two) and the derived dinner coverage.
2. Accept freezer, fridge, and pantry photos plus text corrections. For spoken input, use built-in iPhone keyboard voice-to-text or laptop OS dictation in ordinary text fields. Let the user review and correct the resulting text before submitting; no auto-send microphone flow is needed.
3. Use the current stock snapshot to identify relevant ingredients and uncertain quantities. Ask only confirmations that affect the plan or shopping requirements.
4. Revise naturally: “less red meat,” “less dairy,” “quicker,” “use the freezer chicken,” or swap one recipe. Preserve unaffected meals and update the changed recipes and grocery list consistently.
5. Show a consolidated shopping list with recipe requirements, confirmed on-hand deductions, and missing quantities. Let the user review and approve a saved list revision.
6. Manually launch a separate reusable ChatGPT/Codex desktop browser/computer-use skill. It reads the approved saved list directly, discovers stores for the selected delivery address, compares a bounded set, and builds the chosen cart.
7. Present product quantities, costs, surplus, unavailable items, and substitutions for review. The user handles final review and checkout entirely.
8. Save successful recipes for consistent reuse, including quantities, servings, and later deliberate edits.

Phone and laptop friendly web UI is the target. Laptop-first local hosting is accepted; phone access to the laptop host remains unvalidated. The user may choose to do the whole kitchen workflow on a laptop. V1 does not need phone-triggered remote automation.

## Pantry and buying rules

Treat photos as a current snapshot, not a maintained inventory system. Keep observed items distinct from confirmed usable amounts. A visible item does not establish sufficient quantity; an item outside the photo is not established as absent. Corrections override image guesses. Do not deduct uncertain quantities silently.

Combine requirements across all recipes, normalize compatible units, and subtract only confirmed on-hand amounts. Include every missing ingredient, including staples. Do not assume rice, pasta, garlic, oil, or seasonings are either present or absent. Make unresolved amounts visible before approval rather than inventing precision.

Check existing stock before choosing packs. Accepted household buying defaults:

| Category | Default |
| --- | --- |
| Meat suitable for freezing | Stock-up quantities can be acceptable. |
| Dry rice, pasta, and long-lived sauces | Larger packs can be acceptable. |
| Fresh/perishable vegetables | Stay close to the week's needs to reduce spoilage. |

Always show material excess quantity and the extra cash required for stock-up purchases. Cheap unit pricing alone does not justify unnecessary perishable surplus. These are defaults, not permission to ignore existing stock or the approved list.

## Store comparison and cart requirements

Price comparison **and** delivery-cart creation are required in V1. Begin with approximately two available stores and propose a complete basket from one store by default. The user often orders Walmart and Real Canadian Superstore and knows Costco is available; these are candidate context, not a fixed supported-store list. The logged-in browser's selected address determines actual availability. Never hardcode public Nanaimo store listings; even publicly listed Quality Foods was not visible to the user.

Compare suitable products using real pack sizes, required pack counts, availability, constraints, and total basket cost in CAD. Include visible delivery/service fees, taxes, and applicable promotions; mark unknown or conditional charges and promotion eligibility clearly. State when prices were checked. A basket with missing items is not a directly comparable complete basket. Report “cheapest among the checked candidates,” with the stores and limitations, rather than claiming a universal best price.

The separate desktop skill will use the user's connected, logged-in browser. Browser reliability, address-specific discovery, and list-to-cart integration still need actual proof. API access is not a prerequisite for this selected route. Respect existing unrelated cart items; inspect before adding and reconcile quantities on reruns. Record which list revision produced which cart changes. Changed plans invalidate prior shopping approval: require a new approved revision and reconcile stale additions so old meals and duplicate products do not remain silently.

Flag unavailable ingredients and proposed substitutions, including effects on quantities, recipes, and cost. Material changes must be reviewed; do not silently change the approved plan. Do not place an order, purchase, or complete checkout.

## Preferences, saved state, and consistency

Keep temporary weekly requests separate from explicitly saved household preferences. A request for less dairy this week must not become a permanent restriction. Save household changes only when the user explicitly asks. Successful recipes should retain stable identities and predictable quantities when reused.

Proposed minimal records: planning configuration, household preferences, week and recipe revisions, stock observations with confirmation state, consolidated list revisions with approval state, saved recipes, and cart reconciliation results. Record the configuration used by a week so later changes do not silently alter an approved revision. Preserve a saved recipe's base yield and scale it deliberately to the requested individual portions. Store ingredient totals and units consistently; calculate portion scaling, dinner coverage, aggregation, deductions, and pack arithmetic deterministically. AI proposes and interprets; validated saved data drives the list and cart handoff.

The approved list is the shared handoff artifact, with stable identifiers, revision, quantities/units, constraints, and approval time. The desktop skill consumes it without retyping. Keep the human-readable view and machine-readable handoff derived from the same saved revision. Reloading the planner must preserve the week, recipes, and approved list.

## AI access and technical direction

Start **only with Sign in with ChatGPT using the user's existing Plus allowance**. First verify that this particular locally hosted app can use the documented subscription route. Signing in is separate from granting plan usage, and eligible Plus usage consumes existing shared plan limits. Do not assume sign-in alone provides inference. [ChatGPT Learn](https://learn.chatgpt.com/docs/sign-in-with-chatgpt)

Official guidance documents optional plan usage for open-source and locally hosted apps; paid or remotely hosted offerings have a separate interest process. This supports investigating the proposed local approach, not claiming this app already qualifies or works. [Developer overview](https://developers.openai.com/siwc/token-sharing-open-source)

The preview supports text and image input when the selected model accepts them, but excludes audio/transcription and native hosted computer use. The separately launched desktop shopping skill is a different execution environment; do not present it as a hosted capability of the planner's inference route. [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)

Use a small local web app with local durable storage and one simple replaceable AI boundary. Choose the precise framework and storage implementation after the access proof; avoid premature provider abstractions. Handle failed consent, usage limits, expired sessions, and request failures visibly while preserving saved work. Keep credentials on the host, outside source control and client-delivered code. Phone access, if enabled later, must not expose credentials or an unrestricted public host.

No OpenRouter, multiple providers/models, separate API account/billing, or fallback implementation in V1. OpenRouter was a possible future idea and was explicitly deferred. If the subscription path fails, record the evidence and return to the user for a decision before implementing another billing route. The user has indicated willingness to consider a spending allowance later; none is selected now.

## External integration context

Uber documents consumer store discovery, product/pricing, and cart APIs, but detailed specifications and test credentials remain early access and case-by-case. This project does not depend on securing that access. [Uber Consumer Delivery APIs](https://developer.uber.com/docs/consumer-delivery/introduction)

Uber also describes an existing text/image Cart Assistant beta that produces a draft cart. Availability for this user is unknown; it is context, not an implemented integration or a substitute for proving the selected workflow. [Uber Cart Assistant](https://www.uber.com/us/en/blog/uber-cart-assistant/)

Sources were checked November 11, 2026. Recheck changing preview and integration details before implementation.

## Practical acceptance criteria

- With the initial configuration (2 people, 2 recipes per week, 6 individual portions per recipe), the proposed week explains six household dinners plus one flexible evening, without assigning days.
- Changing household size, weekly recipe count, or portions per recipe through internal configuration updates recipe proposals, scaled quantities, derived coverage, and grocery totals consistently. Verify a non-default combination and a yield that leaves partial household coverage; report leftover portions accurately. No settings UI is required, and future UI controls can use the same configuration and logic.
- A request to change one meal preserves the other and updates ingredient totals and the shopping list together.
- A stock-photo example distinguishes uncertain recognition/amounts from confirmed amounts, asks only relevant questions, and neither infers absence from invisibility nor sufficiency from presence.
- Shared ingredients aggregate correctly; confirmed stock is deducted once; every missing staple remains on the list.
- Weekly preferences remain temporary; explicit household preferences and saved successful recipes survive reload and reuse.
- The planner completes a real local subscription-backed text request, photo request, and change request, with no separate API billing configured.
- The desktop route proves five representative ingredients end to end at one address-available store, then compares two stores using actual quantities and visible basket charges.
- The chosen cart matches the approved list or clearly reports gaps/substitutions; a rerun does not duplicate additions; a revised list does not leave stale additions unnoticed.
- The user can review the full result and complete checkout themselves. One real week works from proposal through cooking and cart review with no shopping-list retyping.
- Ordinary text fields accept iPhone keyboard or laptop OS dictation and allow correction before submission. No custom recording, transcription, realtime voice service, or extra provider/billing is needed for this approach.
- The laptop UI works for the core flow. Test phone layout and host connectivity separately before describing phone use as supported; OS dictation does not solve phone-to-host connectivity.

## Staged next actions — not authorized implementation yet

1. **Prove subscription access:** verify local-app eligibility, then test sign-in/plan consent, text, photo, and a change request. Document limits and failure handling. Stop for a user decision if this route cannot work.
2. **Prove shopping:** test the five-ingredient desktop cart at one store, including pack arithmetic, then compare two address-available stores and verify rerun/revision reconciliation. Leave checkout to the user.
3. **Build the thin integrated planner:** implement simple centralized internal planning configuration with the agreed defaults, derived dinner coverage, snapshot corrections, consistent revision updates, saved recipes, local persistence, and saved approved-list handoff. Do not add a settings UI yet. Test built-in iPhone keyboard and laptop OS dictation in the text fields, including correction before submit; validate laptop use and optional phone access separately.
4. **Try one real week:** review portions, cooking effort, useful prompts, stock deductions, waste, actual basket cost, and manual corrections. Refine from observed friction.

## Deferred and excluded

Lunch planning, fixed day calendars, nutrition optimization, continuous pantry maintenance, automatic remote triggering, multi-store checkout optimization, public hosting, multi-household accounts, extra AI providers, and direct delivery API integration are not required for V1. Custom audio recording, transcription, and realtime voice services are excluded from V1; built-in OS dictation supplies spoken input as editable text without a separate AI billing path.

Current authorization covers this brief and Git setup only. No app, desktop skill, account application, signed-in account browsing, purchase, remote, push, or commit has been authorized as part of setup.
