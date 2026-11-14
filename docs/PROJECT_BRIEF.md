# Food Stuff — Project Brief

Date: November 11, 2026 · Status: agreed direction; local subscription path validated for the tested account/model ([findings](SUBSCRIPTION_PROTOTYPE_FINDINGS.md)); shopping integrations unproven.

## Purpose and users

Build a general personal meal-planning application, starting with dinners. Its initial household configuration is two people, but household size and planning quantities are configurable, not fixed product constraints. Help users choose dinners, cook practical batch recipes, and turn the result into an accurate grocery list and a reviewable delivery cart. Reduce the weekly work of deciding, calculating quantities, checking stock, comparing stores, and entering products. Lunches already have a separate plan for the initial household and are outside V1.

The initial household normally cooks twice, sometimes three times per week. Food choices stay open unless the user specifies a preference. The tool should start with a complete usable proposal rather than requiring a planning interview.

## Configuration and default week

- Keep household size, batch recipe count per week, and individual portions per recipe as distinct internal configuration values in the proof of concept. Initial defaults are 2 people, 2 batch recipes per week, and 6 individual portions per recipe.
- Under those defaults, each recipe covers three dinners for the household: twelve individual portions cover six household dinners, leaving one evening flexible.
- Derive coverage from the active configuration and actual recipe yields, rather than hardcoding six dinners or one flexible evening. For each recipe, divide individual portions by household size to report complete household dinners and any leftover individual portions; do not silently round partial coverage into a full dinner. Report weekly coverage and any uncovered evenings or surplus explicitly.
- Recipes remain flexible; do not assign them to particular days. Permit changes to recipe count, servings, or approach when requested.
- Each recipe includes a concise ingredient list with quantities and units, explicit servings, clear cooking steps, estimated prep and cook times, and a visible reference to its original source.

Centralize these values in a simple internal configuration structure. Planning, portion scaling, coverage calculation, and shopping-list quantities must use the same values. No settings UI or settings framework is needed in the proof of concept. A future web settings UI should be able to expose the same values without rewriting that logic. This setup task adds documentation only, not runtime configuration code.

## Recipe sources

Start live discovery with Good Food and RecipeTin Eats rather than a fixed recipe catalog. Automatically try another suitable sourced recipe when a candidate is blocked or incomplete, and interrupt only when no usable match can be found. Save selected cooking information locally for consistent reuse: ingredients, faithful concise steps, original yield, and attribution; exclude article text, comments, and photos. Reuse and scaling operate on that saved base version. These product choices still require an extraction trial and source access/use checks; they do not establish a completed importer. See [Source selection and recipe display policy](../.scratch/v1-spec/issues/08-source-selection.md).

Every recipe displayed by the app must have an associated, identifiable source, including initial suggestions, replacements, and saved recipes. Show the original recipe link or an identifiable user-supplied source reference alongside the recipe. Save its title, source URL or reference, and author or publisher where available so attribution survives reuse and serving changes. A generated citation is not a source: the recipe must actually come from the referenced material.

V1 will not use AI-generated recipes. AI may find and select existing sourced recipes, faithfully extract or summarize their ingredients and instructions, and interpret planning feedback. Serving quantities may be scaled from the source yield. Do not invent ingredients, cooking steps, or recipe variations. Requests such as “less dairy” or “make this vegetarian” should select an existing sourced recipe that meets the request rather than generate an adaptation. If no suitable sourced recipe is available, explain the gap instead of displaying an invented replacement.

## V1 experience

1. Propose the configured number of sourced meals (initially two) and derived dinner coverage. Each meal has a quick way to browse another recommendation without changing the other meals. Natural-language changes remain available and preserve unaffected choices.
2. Confirm extras in a separate step showing only the recipe's optional items, sides, and serving suggestions as simple item checkboxes. App-generated extras and include/omit recommendations are deferred.
3. Offer freezer, fridge, and pantry photos as the main stock input, with a secondary option to describe stock. Continue also works without adding stock; no separate skip action is needed. Ordinary text fields accept editable OS dictation.
4. When stock is supplied, show extracted observations as a simple list the user can correct before deriving shopping quantities. Keep observed presence distinct from known usable amounts.
5. Show one simple consolidated shopping list: ingredient and quantity to buy. Amount editing should not shift the row's size. Checking an ingredient as covered hides it by default, with a way to show and restore covered items. Keep searchable source, quantity and stock details accessible outside the main list rather than exposing many inputs per row.
6. Before approving the saved revision, show a clean comparison table of ingredient, recipe-required amount and amount to buy. Group covered ingredients first, then purchases. Small recipe tags may identify which meals use an ingredient. Highlight likely oversights in stock or purchase quantities without treating missing observations as absence or silently overriding the user. Keep back navigation to the editable list. Exact attention rules are tracked in [Review attention flags](../.scratch/v1-spec/issues/11-review-attention-flags.md).
7. Manually launch a separate reusable desktop shopping skill. It reads the approved saved revision, discovers address-available stores, compares a bounded set, and builds a reviewable cart. Present quantities, costs, surplus, gaps, and substitutions; the user handles final review and checkout.
8. Save successful recipes for consistent reuse with their source, base yield, ingredients, and faithful concise steps. Changes to the plan update shopping quantities and invalidate prior approval as needed.

Phone and laptop friendly web UI is the target. Laptop-first local hosting is accepted; phone access to the laptop host remains unvalidated. The user may choose to do the whole kitchen workflow on a laptop. V1 does not need phone-triggered remote automation.

## Pantry and buying rules

Treat photos as a current snapshot, not a maintained inventory system. Keep observed items distinct from confirmed usable amounts. A visible item does not establish sufficient quantity; an item outside the photo is not established as absent. Corrections override image guesses. Do not deduct uncertain quantities silently.

Combine requirements across all recipes and normalize compatible units. Offer enough, an amount, or buy the full amount for relevant stock rather than requiring exact measurements. Keep approximations visible and confirm estimated mixed-unit totals. Common seasonings such as salt, pepper, and ordinary spices may be assumed on hand and omitted from shopping, while remaining visible among required ingredients with an easy way to mark them as needed. Keep that assumption distinct from confirmed stock; it does not automatically apply to rice, pasta, garlic, or oil.

Let the user select recipe-listed optional ingredients and serving extras with simple checkboxes before shopping; app recommendations are deferred. For ordinary source yield ranges, scale from the lower bound and show the assumption; flag unusually wide or unclear yields. Detailed quantity rules and acceptance examples are recorded in [Ingredient quantities and pantry confirmation](../.scratch/v1-spec/issues/02-ingredient-quantities.md).

Check existing stock before choosing packs. Accepted household buying defaults:

| Category | Default |
| --- | --- |
| Meat suitable for freezing | Stock-up quantities can be acceptable. |
| Dry rice, pasta, and long-lived sauces | Larger packs can be acceptable. |
| Fresh/perishable vegetables | Stay close to the week's needs to reduce spoilage. |

Always show material excess quantity and the extra cash required for stock-up purchases. Cheap unit pricing alone does not justify unnecessary perishable surplus. These are defaults, not permission to ignore existing stock or the approved list.

## Store comparison and cart requirements

Price comparison **and** delivery-cart creation are required in V1. Begin with approximately two available stores and propose a complete basket from one store by default. The logged-in browser's selected delivery context determines actual availability. Discover candidates from that context rather than hardcoding public city-level listings or a fixed supported-store list.

Compare suitable products using real pack sizes, required pack counts, availability, constraints, and total basket cost in CAD. Include visible delivery/service fees, taxes, and applicable promotions; mark unknown or conditional charges and promotion eligibility clearly. State when prices were checked. A basket with missing items is not a directly comparable complete basket. Report “cheapest among the checked candidates,” with the stores and limitations, rather than claiming a universal best price.

The separate desktop skill will use the user's connected, logged-in browser. Browser reliability, address-specific discovery, and list-to-cart integration still need actual proof. API access is not a prerequisite for this selected route. Inspect existing cart items before adding. Automatically update identifiable task additions on repeats or newly approved versions, including reductions and removals, while preserving unrelated items and avoiding duplicates. Ask when independent user edits make those quantities ambiguous. Record the approved list version and before/after cart changes; inspect uncertain outcomes before retrying. Changed plans invalidate prior shopping approval.

Complete the work that can be done, then gather unavailable ingredients and meaningful proposed replacements into one review, including effects on quantities, recipes, and cost. Equivalent brands and suitable pack sizes can be selected within the approved constraints; changes affecting the sourced recipe or household constraints remain pending review. Do not silently change the approved plan, place an order, purchase, or complete checkout. See [Approved list handoff and cart reconciliation](../.scratch/v1-spec/issues/04-shopping-handoff.md).

## Preferences, saved state, and consistency

Keep temporary weekly requests separate from explicitly saved household preferences. A request for less dairy this week must not become a permanent restriction. Save household changes only when the user explicitly asks. Successful recipes should retain stable identities and predictable quantities when reused.

Proposed minimal records: planning configuration, household preferences, week and recipe revisions with source metadata, stock observations with confirmation state, consolidated list revisions with approval state, saved sourced recipes, and cart reconciliation results. Record the configuration used by a week so later changes do not silently alter an approved revision. Preserve a saved recipe's source and base yield and scale it deliberately to the requested individual portions. Store ingredient totals and units consistently; calculate portion scaling, dinner coverage, aggregation, deductions, and pack arithmetic deterministically. AI selects sourced recipes and interprets feedback; validated saved data drives the list and cart handoff.

The approved list is the shared handoff artifact, with stable identifiers, revision, quantities/units, constraints, and approval time. The desktop skill consumes it without retyping. Keep the human-readable view and machine-readable handoff derived from the same saved revision. Reloading the planner must preserve the week, recipes, and approved list.

## AI access and technical direction

Start **only with Sign in with ChatGPT using the user's existing Plus allowance**. Signing in is separate from granting plan usage, and eligible Plus usage consumes existing shared plan limits. Do not assume sign-in alone provides inference. [ChatGPT Learn](https://learn.chatgpt.com/docs/sign-in-with-chatgpt)

Official guidance documents optional plan usage for open-source and locally hosted apps; paid or remotely hosted offerings have a separate interest process. The prototype result is limited to the tested account/model and does not establish hosted-app eligibility. [Developer overview](https://developers.openai.com/siwc/token-sharing-open-source)

The preview supports text and image input when the selected model accepts them, but excludes audio/transcription and native hosted computer use. The separately launched desktop shopping skill is a different execution environment; do not present it as a hosted capability of the planner's inference route. [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)

Use a small local web app with local durable storage and one simple replaceable AI boundary. Choose the precise framework and storage implementation after the access proof; avoid premature provider abstractions. Handle failed consent, usage limits, expired sessions, and request failures visibly while preserving saved work. Keep credentials on the host, outside source control and client-delivered code. Phone access, if enabled later, must not expose credentials or an unrestricted public host.

No OpenRouter, multiple providers/models, separate API account/billing, or fallback implementation in V1. OpenRouter was a possible future idea and was explicitly deferred. If the subscription path fails, record the evidence and return to the user for a decision before implementing another billing route. The user has indicated willingness to consider a spending allowance later; none is selected now.

## External integration context

Uber documents consumer store discovery, product/pricing, and cart APIs, but detailed specifications and test credentials remain early access and case-by-case. This project does not depend on securing that access. [Uber Consumer Delivery APIs](https://developer.uber.com/docs/consumer-delivery/introduction)

Uber also describes an existing text/image Cart Assistant beta that produces a draft cart. Availability for this user is unknown; it is context, not an implemented integration or a substitute for proving the selected workflow. [Uber Cart Assistant](https://www.uber.com/us/en/blog/uber-cart-assistant/)

Sources were checked November 11, 2026. Recheck changing preview and integration details before implementation.

## Practical acceptance criteria

- Every displayed recipe has a visible, identifiable original source. Saved recipes and serving-scaled versions retain their source metadata; ingredients and instructions are traceable to that source. No AI-generated recipes or invented variations appear in V1.
- With the initial configuration (2 people, 2 recipes per week, 6 individual portions per recipe), the proposed week explains six household dinners plus one flexible evening, without assigning days.
- Changing household size, weekly recipe count, or portions per recipe through internal configuration updates recipe proposals, scaled quantities, derived coverage, and grocery totals consistently. Verify a non-default combination and a yield that leaves partial household coverage; report leftover portions accurately. No settings UI is required, and future UI controls can use the same configuration and logic.
- A request to change one meal selects a suitable sourced replacement, preserves the other, and updates source references, ingredient totals, and the shopping list together. If no suitable source is available, the app reports that limitation without inventing a recipe.
- A stock-photo example distinguishes uncertain recognition/amounts from confirmed amounts, asks only relevant questions, and neither infers absence from invisibility nor sufficiency from presence.
- Shared ingredients aggregate correctly; confirmed stock is deducted once; mixed-unit estimates are visible and confirmed. Common seasonings assumed on hand remain visible among requirements and can be marked needed; other missing staples remain on the list. Optional extras reflect the user's reviewed selection.
- Weekly preferences remain temporary; explicit household preferences and saved successful recipes survive reload and reuse.
- The planner completes a real local subscription-backed text request, photo request, and change request, with no separate API billing configured.
- The desktop route proves five representative ingredients end to end at one address-available store, then compares two stores using actual quantities and visible basket charges.
- The chosen cart matches the approved list or clearly reports gaps/substitutions; a rerun does not duplicate additions; a revised list does not leave stale additions unnoticed.
- The user can review the full result and complete checkout themselves. One real week works from proposal through cooking and cart review with no shopping-list retyping.
- Ordinary text fields accept iPhone keyboard or laptop OS dictation and allow correction before submission. No custom recording, transcription, realtime voice service, or extra provider/billing is needed for this approach.
- The laptop UI works for the core flow. Test phone layout and host connectivity separately before describing phone use as supported; OS dictation does not solve phone-to-host connectivity.

## Staged next actions — not authorized implementation yet

1. **Implement and validate shopping:** the user deferred a preliminary live cart trial during planning. The browser and local-file access checks are enough to continue the specification. During implementation, validate representative ingredients at one store, pack arithmetic, two-store comparison and rerun/revision behavior. Leave checkout to the user; cart correctness remains unproven until tested.
2. **Build the thin integrated planner:** implement source-backed recipe selection and visible attribution, simple centralized internal planning configuration with the agreed defaults, derived dinner coverage, snapshot corrections, consistent revision updates, saved sourced recipes, local persistence, and saved approved-list handoff. Do not add a settings UI yet. Test built-in iPhone keyboard and laptop OS dictation in the text fields, including correction before submit; validate laptop use and optional phone access separately.
3. **Try one real week:** review portions, cooking effort, useful prompts, stock deductions, waste, actual basket cost, and manual corrections. Refine from observed friction.

## Deferred and excluded

AI-generated recipes and invented recipe variations are excluded from V1. Lunch planning, fixed day calendars, nutrition optimization, continuous pantry maintenance, automatic remote triggering, multi-store checkout optimization, public hosting, multi-household accounts, extra AI providers, and direct delivery API integration are not required for V1. Custom audio recording, transcription, and realtime voice services are excluded from V1; built-in OS dictation supplies spoken input as editable text without a separate AI billing path.

The local subscription prototype is a technical access proof, not an implementation of the planner or cart workflow. This does not authorize the complete Food Stuff application, cart skill, account applications, signed-in account browsing, purchase, remote, or push.
