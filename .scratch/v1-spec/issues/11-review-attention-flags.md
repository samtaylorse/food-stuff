# Review attention flags

Type: grilling
Status: resolved
Resolved by: live discussion with user, November 14, 2026
Parent: ../map.md
Blocked by: 02, 03

## Answer

- Compare recipe need with known usable stock plus the proposed purchase, not purchase quantity versus stock alone. For example, a 600 g requirement with 400 g on hand and 200 g to buy is correctly covered and does not need a shortage flag.
- Flags are advisory. Explain the concern without requiring acknowledgement of every flag; the user may edit or approve the list. Intentional stock-up choices should not repeatedly trigger the same concern.
- Unreported stock is a subtle information label, not a warning on every ingredient. Buying the full required amount when stock is unknown, or when the user confirms none, is normal.
- Flag a clear excess mismatch that ordinary pack sizes or an intentional stock-up do not explain. Do not apply a blanket twice-the-need rule. Show normal surplus in details and preserve user edits.
- For example, needing 300 g broccoli and buying 3 kg warrants attention when there is no pack-size or stock-up explanation. Needing 300 g and buying a 500 g bag is normal pack rounding, not a special warning. These examples establish the intended distinction, not a universal multiplier threshold.
- Keep numerical shortfalls grounded in known or explicitly estimated stock; preserve estimate labels. Unknown stock is not zero confirmed stock. Advisory flags must explain their basis rather than invent certainty.

### Acceptance examples

- Require 500 g rice, stock unreported, buy 500 g: no warning; details may say Stock not checked.
- Require 500 g rice, user confirms none, buy 500 g: no warning.
- Require 500 g rice, confirmed stock 200 g, buy 100 g: indicate a 200 g shortfall.
- Require 600 g, confirmed stock 400 g, buy 200 g: no shortfall or buy-less-than-stock warning.
- Require 300 g broccoli, buy 3 kg without an explanation: draw attention to the excess; allow the user to keep it.
- Require 300 g broccoli, buy a 500 g bag: ordinary rounding, with surplus available in details.
- An explicitly accepted stock-up remains visible in the list and cost summary without repeatedly raising the same concern.

## Question

Which stock and purchase comparisons should draw attention on the approval review, and how can the app flag likely oversights without clutter or false alarms?

The user requested cues for ingredients not reported in stock, purchase amounts lower than the amount believed on hand, and purchases much larger than the recipe needs. Interpret these comparisons in context: missing stock observations do not establish absence, and buying less than an on-hand amount is not inherently an error. Compare recipe requirement, confirmed/estimated stock, remaining need and proposed purchase; distinguish incomplete coverage, potentially unnecessary purchases, and surplus from pack sizes or intentional stock-up.

Decide thresholds for unusually large quantities, which cues are subtle status labels versus attention flags, how estimates and seasoning assumptions are shown, and whether any condition requires acknowledgement. Preserve the user's quantity edits and accepted stock-up preferences. Explain a flag's basis without silently changing the list or treating an uncertain observation as confirmed stock.

Keep the accepted flow. A compact review table and accessible details should reveal likely mistakes without adding an input or warning to every row. This ticket refines review behavior; it does not reopen meal selection or require polishing the whole UI.
