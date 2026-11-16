# 05: Choose extras and build the shopping list

**What to build:** Choose recipe-listed extras in a dedicated simple step, then see and edit a consolidated list of ingredients to buy, even when no stock check is supplied.

**Blocked by:** 04: Discover and refine sourced meals.

**Status:** ready-for-agent

- [ ] Show only recipe-listed optional sides/toppings/serving suggestions, grouped by meal as items with checkboxes. Selecting none is valid; add no app-generated extras or recommendation/provenance panels.
- [ ] Scale selected requirements from saved base yields. Use the visible lower bound of ordinary ranges, preserve uncertainty for unclear yields, count equivalent measures once and leave unquantified extras explicit rather than inventing source amounts.
- [ ] Aggregate compatible ingredients across meals/extras using deterministic arithmetic, with preparation and measurement basis preserved. Unsupported conversions remain explicit; mixed-unit estimates require a visible basis and user confirmation.
- [ ] Allow Continue without any stock input through the same action used to continue normally, without a separate skip button or blocking prompt. Default shopping targets reflect required purchases pending later stock decisions.
- [ ] Present item and purchase quantity with stable-size editing. Purchase overrides change what to buy, not source recipe requirements. Show ingredient/source/quantity/recipe membership in separately accessible searchable details.
- [ ] Save extras and purchase edits with expected revisions, survive reload, and preserve newer changes when requests finish late. Supply complete derivation information for later stock and approval behavior.
- [ ] Add focused table-driven quantity tests and representative real-persistence workflow tests for shared ingredients, yield ranges, alternatives, unknown quantities, invalid edits and overrides. Do not duplicate every arithmetic case through HTTP or the browser.
- [ ] Extend Playwright to select extras, continue with no stock and edit a shopping quantity; verify the concise rendered flow without debugging examples or dense calculation controls.
