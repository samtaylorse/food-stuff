# 03: Connect the ChatGPT subscription

**What to build:** Connect the local app to the user's eligible ChatGPT subscription, show connection/model status and provide usable host-side text/image inference with clear failure recovery. Other planner work remains testable with controlled responses while this integration is developed.

**Blocked by:** 02: Create and reopen a sourced dinner plan.

**Status:** ready-for-agent

- [ ] Provide sign-in and connection status through the local UI, with account-visible model discovery and explicit plan-usage scope gating. Identity sign-in alone must not enable inference; do not add API billing, provider fallback or OpenRouter.
- [ ] Reuse reviewed protocol learnings without applying or modifying the preserved prototype stash. Implement stable host identity, initial registration, persisted client identity, fresh state/nonce/PKCE, exact callback checks, identity-token verification and returning-user consistency.
- [ ] Handle refresh and scope changes, expired access, consent rejection, quota limits and model/request errors while preserving saved planner work. Keep credentials host-side with accurately described storage protection.
- [ ] Expose the same inference interface used by controlled test responses. Support bounded text/images, required explicit context, the validated streaming route and completed-only results. Do not save partial output as successful application state.
- [ ] Make the live adapter available to recipe and stock workflows without requiring a separate test-only application design. Live checks of those workflows require this ticket, but their implementation and ordinary tests do not.
- [ ] Focused protocol tests cover invalid state/nonce/tokens, identity/scope mismatches, refresh behavior, model filtering, image limits and interrupted/failed/completed streams. Verify public HTTP callback/Host/Origin guards using no real credentials in the default suite.
- [ ] Separately verify the supported live subscription route with bounded text and image requests when the signed-in context is available. Record actual evidence and access limitations privately; do not claim live success from fixtures alone.
- [ ] Preserve the existing valid state after cancellation, restart or failure and keep tokens, account responses and personal inputs out of tracked fixtures and logs.
