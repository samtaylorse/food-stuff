# 06: Correct stock and reduce purchases

**What to build:** Describe stock, review and correct extracted observations, then reduce shopping quantities using quick explicit decisions while keeping uncertainty and all recipe requirements accessible.

**Blocked by:** 05: Choose extras and build the shopping list.

**Status:** ready-for-agent

- [ ] Interpret text into editable stock observations before applying final deductions. Keep input and interpretation behind the same inference interface as the live adapter; controlled responses support implementation without ticket 03.
- [ ] Distinguish observed presence/identity, exact or approximate usable amounts, and user decisions. Unreported items remain unknown; user corrections override AI observations.
- [ ] Support Enough, an exact/approximate amount and Buy the full amount. Enough is scoped to the confirmed requirement and needs rechecking after an increase; buying the full amount does not assert zero stock.
- [ ] Aggregate requirements before deducting effective stock once. Preserve estimated labels, incompatible units and the distinction between requirements, available stock and editable purchases.
- [ ] Assume common seasonings on hand while keeping them discoverable and overridable. Do not extend the assumption to all staples or invent gram amounts for to-taste ingredients.
- [ ] Hide covered shopping items by default, with an obvious way to reveal and restore them. Keep source/stock/quantity reasoning accessible and searchable without cluttering the main list.
- [ ] Save observations and decisions with revision checks, restore after reload and preserve manual edits against late inference results. Continue remains valid without input.
- [ ] Verify missing stock, sufficient/partial/approximate amounts, shared ingredients, increased requirements, seasoning overrides and hidden-item recovery with workflow and focused tests. Add representative Playwright coverage and agent UI verification.
