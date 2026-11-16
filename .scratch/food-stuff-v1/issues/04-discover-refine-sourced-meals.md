# 04: Discover and refine sourced meals

**What to build:** Propose a complete sourced dinner week, browse another recommendation for one meal, and refine choices using natural-language requests without disturbing unrelated selections or losing newer edits.

**Blocked by:** 02: Create and reopen a sourced dinner plan.

**Status:** ready-for-agent

- [ ] Discover candidates across Good Food and RecipeTin Eats rather than relying on a fixed catalog. Retrieve actual source material, validate normalized records and save reusable base versions with attribution and field provenance.
- [ ] Consider structured ingredients, method and relevant notes, including method-only water, alternative measurements, dry/cooked and net/drained meaning, optional extras and different author/yield/instruction shapes. Keep missing times unknown and do not scale cooking time with ingredient amounts.
- [ ] Display source links and faithful bullet-point meal previews. No invented ingredients, cooking instructions, yields or variations; dietary changes select another suitable sourced recipe.
- [ ] Replace one meal independently and accept editable natural-language requests, compatible with OS dictation. Keep weekly requests separate from preferences saved only on explicit instruction; reuse saved recipes without changing their base versions silently.
- [ ] Retry suitable alternatives for blocked/incomplete candidates, with bounded external work. Explain failure when no usable match remains; do not fill gaps from model memory or overwrite valid saved data with incomplete output.
- [ ] Apply changes transactionally against expected revisions. Reject late/cancelled/stale output, preserve the last valid saved week after failures and prevent duplicate saves on retries.
- [ ] Implement and test through controlled external responses independently of ticket 03. When the live subscription adapter is available, use the same workflow and verify real discovery and refinement; no alternate billing route is permitted.
- [ ] Use focused extraction/normalization examples plus integrated controlled-source-to-saved-recipe cases. Verify independent replacement, preferences, failure recovery and stale-result handling through the public workflow; extend Playwright for the visible selection flow.
- [ ] Bound source retrieval and redirects, treat retrieved content as untrusted data, and retain concise source-backed fields rather than whole articles, comments or images.
