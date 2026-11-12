# Subscription Prototype Findings

Date: November 11, 2026

## Result

Using an existing ChatGPT Plus plan grant, the local prototype completed three real streamed requests on `gpt-6.1-sol`, selected from the signed-in account's model list:

1. Two dairy-light batch dinner recipes, six individual portions each, with quantities, steps, prep/cook times, and one combined shopping list.
2. A pantry-photo review that separated clear observations from uncertain identifications and did not infer exact quantities, unseen absence, or sufficiency.
3. A follow-up that kept recipe one unchanged, replaced recipe two with a vegetarian recipe, and updated the combined list.

Each stream reached `response.completed`. This is a successful access and flow smoke test, not a proof of recipe, quantity, food-safety, grocery-list, or image-recognition reliability. Only this account/model was tested. Sanitized request results remain in the ignored `local/validation-results.json`; the input photo and raw responses are not in tracked documentation.

## Integration findings

- **Registration:** The documented open-source Sign in with ChatGPT flow is a public client flow and needs no developer API key or client secret. Persist an opaque `ext_agent_host_id` before first sign-in and reuse it for that host; it is distinct from the issued `client_id`. Use `dynamic_agent_client` only to start first registration. Save the issued client ID returned by the new-registration callback before exchanging the code, then reuse it for returning sign-ins.
- **Authorization and callback:** Use `https://auth.openai.com/api/accounts/authorize` and form-encoded code/refresh exchanges at `https://auth.openai.com/api/accounts/oauth/token`. Generate fresh `state`, OIDC `nonce`, and PKCE S256 verifier/challenge per attempt. For this local app, the callback was `http://127.0.0.1:1455/auth/callback`; keep scheme, host, path, and selected port exact between authorization and token exchange. Do not substitute `localhost`. The callback can be reached by the cross-site browser navigation needed for OAuth, so validate state and the pending transaction there. Other requests stay loopback-only, require the exact local `Host`, reject foreign `Origin` and cross-site fetches, and require exact same-origin plus JSON for mutations. Safe same-origin GETs can arrive without an `Origin` header.
- **Tokens and identity:** Request identity scopes plus `offline_access`, `resource.invoke`, and `chatgpt.tokens.use.direct`, with resource `https://api.openai.com/v1`. Verify the ID-token signature with the issuer's JWKS and check issuer, issued-client audience, expiry, nonce, and nonempty subject. Require the granted plan-usage scope before enabling model discovery or inference. On return, compare the verified subject with the selected saved account before replacing credentials. Refresh before expiry; preserve the previous scope only if a refresh response omits `scope`, and disable plan inference if the refreshed scope no longer grants it.
- **Models and responses:** Discover models from `GET https://api.openai.com/v1/models` and show only entries marked visible for listing; do not hardcode a model catalog. Send `POST https://api.openai.com/v1/responses` with the selected account model, explicit conversation history in `input`, `store: false`, and `stream: true`. Text and model-supported image input worked. Forward text deltas, but count a request as successful only after `response.completed`; failed, incomplete, or prematurely ended streams are not completed answers. Follow-ups resend the needed user/assistant history rather than relying on stored response state.
- **Voice:** An ordinary text field can receive editable text from laptop/phone OS keyboard dictation. That is separate from audio inference, recording, or transcription; this prototype did not test audio input.
- **Local storage:** The prototype kept OAuth credentials on the local server, outside the repository and browser-delivered code. On Windows it restricted the app-data directory ACL to the current user, SYSTEM, and local administrators. These files were access-controlled, not encrypted. This is a prototype choice, not a required storage architecture.

## Reproducing the checks

After restoring the source stash below, use Node.js 22 or later, run `npm install`, then `npm test`. The 13 local tests cover OAuth state/nonce/PKCE and callback checks, plan-scope gating, visible-model filtering, bounded text/image inputs, explicit streamed Responses request shape, protected credential-file ACLs, and local HTTP origin/callback behavior. The real request checks require a user-authorized sign-in and a model currently returned for that account; repeat the three request types listed above. The image fixture and sanitized output remain in ignored `local/` if still present.

Sandbox policy can deny npm registry access during dependency installation or loopback access during local HTTP tests. Treat those as environment permission failures and rerun with the required access; they do not establish that the OpenAI route or product is incompatible.

## Limits

The test covered one local account and one account-visible model. It does not establish hosted-app eligibility, mobile-to-laptop connectivity, or shopping discovery, pricing, or cart behavior. A few generated recipes and lists are not a correctness evaluation, and a single pantry image cannot establish reliable inventory, quantities, absence, or sufficiency. Keep those values reviewable and user-confirmed in a future planner.

## Prototype recovery

The source, UI, tests, package files, and prototype README are held at stash commit `df1312e8796ca9416284f2f2f655bc740c34da3f`, named `prototype: validated ChatGPT subscription integration` (`stash@{0}` when saved). When implementation resumes, inspect the stash and current documentation, create a clean separate branch/worktree at the intended baseline, then apply it without dropping the stash: `git stash apply df1312e8796ca9416284f2f2f655bc740c34da3f`. Reconcile its prototype README with the current product README and brief rather than overwriting them blindly. After restoration, install dependencies with `npm install`; `node_modules/` is not included. The ignored `local/` folder (including the photo, validation output, and helper script) and the Windows credential directory are not part of the stash.

## Official references

- [Sign in with ChatGPT: open-source overview](https://developers.openai.com/siwc/token-sharing-open-source)
- [Registration and sign-in](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [Models and inference](https://developers.openai.com/siwc/token-sharing-open-source/models-and-inference)
- [Accounts and sessions](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions)
- [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)
- [Responses API streaming](https://developers.openai.com/api/docs/guides/streaming-responses)
