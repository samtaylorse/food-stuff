# Ingredient quantities and pantry confirmation

Type: grilling
Status: resolved
Resolved by: live discussion with user, November 12, 2026
Parent: ../map.md
Blocked by: 01

## Question

What representation and confirmation rules make sourced recipe scaling, shared-ingredient aggregation, and pantry deductions accurate enough for approval?

Resolve source yields, mass versus volume, count versus weight, optional ingredients, preparation differences, incompatible units, and uncertain quantities. Define minimum user questions for visible stock with unknown remaining quantity and acceptance examples for trustworthy totals. Preserve deterministic arithmetic and explicit uncertainty.

## Answer

- For relevant stock, offer **enough**, **an amount**, or **buy the full amount** rather than requiring an exact measurement for every ingredient. The user accepted this on November 12, 2026.
- Enough covers the current ingredient requirement, not an unlimited or exact stock quantity; if a later revision increases the requirement, confirm again.
- A supplied amount reduces what must be bought. Preserve whether it was approximate rather than presenting it as a measured quantity.
- Buy the full amount explicitly resolves the shopping decision without asserting that the ingredient is absent.
- Combine shared ingredients even when sources use different units. Use exact conversions where possible; otherwise propose a clearly labelled approximate combined amount for user confirmation. Preserve the original quantities and the conversion basis.
- Before shopping, let the user select the recipe's explicitly optional ingredients and serving extras. Selected extras contribute to the approved list. During [planner interaction review](03-planner-interaction.md), the user simplified this to plain item checkboxes and deferred app recommendations, superseding the earlier recommendation-based presentation.
- For source ingredients listed as **to taste**, retain that wording instead of inventing a numeric quantity. If purchasing is needed, select an appropriate normal pack rather than implying an exact recipe requirement.
- Common seasonings such as salt, pepper, and ordinary spices may be **assumed on hand** by default and omitted from shopping, but must still appear among all required ingredients with an easy way to mark them as needed. An assumption is distinct from confirmed stock. This is a user-approved exception to the original brief's blanket rule against assuming staple availability; it does not automatically cover rice, pasta, oil, or every pantry item.
- For ordinary source yield ranges, scale from the **lower bound**, display that assumption, and avoid an extra confirmation prompt. For example, treat serves 4–6 as four when scaling to six, multiplying ingredient quantities by 1.5. This favors extra leftovers over insufficient food. Flag unusually wide or unclear yields rather than silently choosing a precise yield.
- Preserve source ingredient quantities, units, preparation state, and yield alongside the shopping interpretation. An estimate needs a defensible conversion basis; dry versus cooked amounts or drained versus net weights are not interchangeable just because ingredient names match. If no useful conversion is available, keep the requirements visible and resolve the uncertainty rather than inventing precision.

### Acceptance examples

- For a 500 g rice requirement, enough removes the purchase need; a confirmed 200 g leaves 300 g to buy; buy the full amount leaves 500 g to buy without asserting zero stock. A later increase triggers re-confirmation if only enough was recorded.
- Combine two onions and 200 g onion into a proposed approximate total with a visible conversion basis; preserve the original requirements and let the user confirm the estimate.
- Show the recipe's optional garnishes before shopping and apply the user's checkbox selection to list totals; app recommendations are deferred.
- Show salt listed to taste among required ingredients as assumed on hand. Marking it needed adds an appropriate pack requirement without inventing a recipe amount.
- A source serving 4–6 scales to six from the lower bound of four. A conspicuously broad range such as 2–12 is flagged instead of silently treated as exact.

## Prototype preparation

**List review logic prototype** (`prototypes/PROTOTYPE-list-review.html` at commit `8de2cee88b52bc2ba5c7bf05b3f9f64386f38885`) and **walkthrough** (`prototypes/PROTOTYPE-list-review-walkthrough.md` at commit `8de2cee88b52bc2ba5c7bf05b3f9f64386f38885`) are captured on `prototype/list-review`, outside main. The original demo blocks approval on unresolved amounts; the decisions above supersede that hypothesis by permitting enough and buy the full amount, plus the explicit common-seasoning assumption. The throwaway demo has not been updated to implement these decisions.

Both scripts, model scenarios, and a minimal DOM initialization were checked independently by the parent. Real browser rendering was not checked. Synthetic examples do not establish source scaling or real product conversions. Resolution came from the live discussion, not an assertion that the user accepted every prototype behavior.
