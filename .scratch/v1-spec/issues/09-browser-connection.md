# Connect the browser and verify shopping context

Type: task
Status: resolved
Resolved by: fresh browser-check chat, November 13, 2026
Mode: human-in-the-loop
Parent: ../map.md
Blocked by: 05

## Answer

A fresh local chat configured with `gpt-6.1-terra` and Medium reasoning had the required Computer Use runtime. Its initial browser inventory was empty and selecting the built-in browser returned `Browser is not available: iab`. Opening the target website in that chat's own built-in browser pane made ordinary read-only inspection available.

The check confirmed access to the authenticated grocery interface and address-specific store discovery. Account identifiers, delivery addresses, order history and the observed store list are intentionally excluded. The finding is browser capability, not a fixed store support list or a guarantee of later availability.

Local file access was confirmed by reading a planning record and a synthetic JSON handoff fixture. The fixture contained only a test list ID, revision, dry rice 500 g, and `authorizedForCart: false`. It was not a real approved shopping list. Ensure a fixture exists at the shared path before another chat tries to read it; sandbox-specific temporary directories can differ between execution contexts.

No cart, delivery configuration or account settings were changed. This proves read-only browser and local-file access, not product selection, pricing, list-to-cart behavior or repeat-run correctness. The preliminary live cart trial was subsequently [deferred during planning](06-cart-behavior-trial.md).

## Reusable connection checklist

1. Use the selected built-in browser profile and check that the supported browser runtime is actually available. Installation and enabled settings alone are not proof of tool exposure in a particular chat.
2. If the chat has browser tools but an empty inventory, open the target page in that chat's own built-in browser pane and rediscover it.
3. Verify only the access needed for the task. Keep private account and delivery details in local run state, outside tracked documentation.
4. Read a harmless local handoff fixture to establish file access. A planning record alone is not proof of an implemented approved-list handoff.
5. If the runtime is absent, report the exact blocker rather than using shell, cookie or private browser-protocol workarounds.

## Original question

Can the desktop task access the selected built-in browser session and a local shopping-list artifact without changing a cart?

Evidence is the completed read-only browser check and synthetic local-file read. Cart implementation still requires its own acceptance checks; checkout remains the user's responsibility.
