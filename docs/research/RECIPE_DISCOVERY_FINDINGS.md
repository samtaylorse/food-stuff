# Recipe discovery findings

Observed November 11, 2026 (local checks approximately 21:09–21:18 MST; UTC November 12). Research branch: `research/recipe-discovery`. Scope: live sourced dinner discovery for a local, personal Food Stuff V1 using the existing ChatGPT Plus allowance; no generated recipes, separate paid API/provider, account signup, or software installation.

## Recommendation

Use subscription-backed hosted `web_search` to discover candidate URLs on a small vetted publisher allowlist, then independently fetch and validate each permitted original recipe before selection. **The discovery route worked on the tested account/model. The complete recipe pipeline and a permission-cleared multi-site source set are not yet proven.** Keep those as distinct acceptance gates. This is a recommendation for the next bounded proof, not an assertion that these four publishers have licensed a recipe-import product.

The practical boundary is `discover candidates -> validate original source -> select immutable sourced recipe -> deterministic scaling`. AI ranks real candidates and interprets requests; it never fills missing ingredient quantities, yield, steps, or recipe variations from memory. A search citation alone is not a complete recipe. Failed retrieval produces an explicit unavailable-source result.

Start the next technical proof with Good Food and RecipeTin Eats as **technical candidates**, subject to their publisher constraints below. Budget Bytes is attractive for batch dinners but its published no-scraping provision prevents treating a scraper as an approved route. Serious Eats failed ordinary HTTP access in this environment. Do not silently broaden the allowlist or introduce another billing route to make results appear complete.

## Subscription search: documentation versus actual test

Official OpenAI preview documentation makes web search conditional on model and account/workspace policy. It excludes hosted file search, Code Interpreter, native computer use, hosted MCP/connectors and Responses `tool_search`; local custom/function execution is a separate capability. HTTP requests require streaming, `store: false`, explicit input/history, and omission of unsupported fields such as `max_tool_calls` and `max_output_tokens`. [Preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)

General Responses documentation supports `web_search.filters.allowed_domains`, includes subdomains, and exposes consulted URLs through `include: ["web_search_call.action.sources"]`. This general documentation alone does **not** establish subscription entitlement or full-content retrieval. [Web search: domain filtering and sources](https://developers.openai.com/api/docs/guides/tools-web-search#domain-filtering)

**Tested:** one real request using the existing authorized local Plus grant, account-visible `gpt-6.1-sol`, direct `POST https://api.openai.com/v1/responses`, no API key or separate billing configuration:

```json
{
  "model": "gpt-6.1-sol",
  "store": false,
  "stream": true,
  "input": [{
    "role": "user",
    "content": "Use web search to find the original Good Food chilli con carne recipe. Return only its title, source URL, and stated servings. Do not reproduce ingredients or directions."
  }],
  "tools": [{
    "type": "web_search",
    "filters": {"allowed_domains": ["bbcgoodfood.com"]}
  }],
  "include": ["web_search_call.action.sources"]
}
```

Observed HTTP 200, `response.web_search_call.completed`, then `response.completed` with response status `completed`. Answer identified the original [Good Food chilli con carne](https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe), serving four. Twelve reported source URLs were all under `bbcgoodfood.com`, including two `tollbit.bbcgoodfood.com` URLs. These are reported consulted sources, not proof of complete content access or a publisher license. The tool accepted domain filtering in this request; this single positive test cannot guarantee all future queries, policies, models, accounts, quotas or subdomains.

The existing prototype's refresh and protected storage logic was reused after inspecting stash `df1312e8796ca9416284f2f2f655bc740c34da3f` (untracked source in its third parent). Credential contents, identity and tokens were never printed or copied into the repository. No new login was performed. The prior [subscription findings](../SUBSCRIPTION_PROTOTYPE_FINDINGS.md) prove text/image turns; this adds a search turn, not a complete recipe-import test. No additional live inference calls are needed to establish this narrow result.

Do not assume that ordinary API tool pricing describes this grant's allowance or that Plus gives unlimited free search. This run established successful execution through the selected existing plan route; search-specific quota accounting, limit behavior and repeated availability remain unmeasured. Preserve the existing no-extra-billing policy.

## Publisher evidence

All four first-party recipe pages were readable through the research web reader on the observation date. That reader may use different access paths or cached/indexed text. The following ordinary HTTP tests are separate observations, made with Python standard-library `urllib`, timeout 20 seconds, and honest user agent `FoodStuffResearch/0.1 (local personal recipe feasibility check)`.

| Publisher and original example | Source card observed | App-like HTTP and Recipe JSON-LD observation | V1 implication |
| --- | --- | --- | --- |
| [RecipeTin Eats: Lentil Soup](https://www.recipetineats.com/lentil-soup/) | Nagi; 6 servings; prep 10m, cook 45m; ingredients, serving extras, instructions and notes | HTTP 200; 520,141 decoded characters; Recipe object named Lentil Soup, author Nagi@RecipeTin Eats, yield `["6"]`, `PT10M` prep, `PT45M` cook, `PT55M` total; 15 ingredient lines, 7 top-level instruction items | Strong technical extraction candidate; preserve notes/serving extras; sharing permission unresolved |
| [Good Food: Chilli con carne](https://www.bbcgoodfood.com/recipes/chilli-con-carne-recipe) | Good Food team; 4 servings; prep 10m, cook 1h; ingredients and method | HTTP 200; 593,745 decoded characters; Recipe yield 4, author Good Food team, 16 ingredient lines and 16 instruction items; JSON-LD had `PT1H10M` total but no separate prep/cook fields | Strong technical candidate; HTML supplies fields missing from schema; quantities in directions matter |
| [Budget Bytes: Slow Cooker Vegetarian Lentil Chili](https://www.budgetbytes.com/slow-cooker-vegetarian-lentil-chili/) | Beth Moncel; 6 portions of 1.5 cups; prep 10m, cook 4h; 17 ingredient lines and 3 card instructions | Initial sandbox DNS failure; no successful direct page fetch/JSON-LD measurement. Further direct fetching stopped after reading no-scraping terms | Excellent meal fit; exclude automatic scraper absent permission/clarification |
| [Serious Eats: The Best Chili Ever](https://www.seriouseats.com/the-best-chili-recipe) | J. Kenji López-Alt; yield 6–10; prep 25m, cook 4h, soaking 8h; ingredients and directions | Ordinary HTTP 403; no bypass or repeat, no JSON-LD verified | Poor first adapter; yield range and long process add ambiguity |

Counts are lines/items, not guaranteed ingredient entities or normalized steps. Technical fixtures intentionally report metadata and counts, without copying complete recipes into this research document. Measurements are one-page snapshots, not site-wide reliability statistics.

Publisher statements and observed constraints:

- **Budget Bytes:** section 4.3.3 prohibits scraping/crawling/spidering; section 2.2 restricts republication/distribution and commercial copying; free navigation and printing are described separately. Its FAQ requires permission for recipes/photos on other websites. This is a published restriction, not an opinion that every personal cooking use is unlawful. [Terms](https://www.budgetbytes.com/terms-conditions/), [FAQ](https://www.budgetbytes.com/faq/)
- **RecipeTin Eats:** its sharing policy allows limited attributed image/link use, prohibits unapproved commercial use, and specifically withholds permission to share ingredients or directions except limited circumstances. This does not establish a blanket prohibition on private personal reading, but also does not grant an app permission to redisplay/save full recipes or send them to an inference service. Its robots file had a general empty Disallow and specific bot exclusions. Robots accessibility is not a reuse license. [Recipe/image policy](https://www.recipetineats.com/policy-use-of-recipes-images/), [privacy/terms](https://www.recipetineats.com/nagi-recipetin-eats/privacy-disclosure/), [robots](https://www.recipetineats.com/robots.txt)
- **Good Food:** the recipe HTML footer links to Immediate's terms. Section 5 permits personal noncommercial access and personal adaptations; section 10 separately restricts copying/storage except as specifically permitted. These provisions do not conclusively authorize automatic extraction, durable local redistribution, or model transfer. Robots disallows `/search*`, `/api/*`, and named bots including GPTBot, while also publishing search/AI-training content signals. Do not reduce these to either universal permission or a universal AI ban. [Publisher terms](https://www.immediate.co.uk/terms-and-conditions/), [robots](https://www.bbcgoodfood.com/robots.txt)
- **Serious Eats:** source page access differs between research reader and ordinary HTTP. A guessed `/legal` URL was inaccessible; corporate legal-page discovery was blocked. Applicable reuse/access terms were not successfully retrieved, so permission remains unknown. Its [About page](https://www.seriouseats.com/about-us-5120006) identifies People Inc. ownership and a contact channel; it supplies no verified recipe-import permission in this investigation.

No permission request was sent. This report records publisher statements and uncertainty; it does not decide enforceability, Canadian copyright exceptions, or whether a private local implementation constitutes publication. Attribution is necessary for the product but insufficient evidence of access/reuse rights. Scope requiring clarification includes automated access, full-text persistence, display, and transfer to the inference provider.

## Live discovery without another paid provider

**Preferred next proof:** hosted search on the tested Plus route with two or three explicitly selected domains, source URLs returned as structured candidates, followed by bounded app-side original-page validation where permitted. Enforce the approved host/path list again locally, because the domain filter includes subdomains and can return gateways, community content, premium pages or collections. Do not accept a search snippet as a recipe.

**Alternative if hosted search stops working:** per-site native search/category discovery through a small adapter, followed by the same validator. Two ordinary native searches returned HTTP 200 with new recipe links:

- [RecipeTin native lentil search](https://www.recipetineats.com/?s=lentil) returned, among others, Thai red lentil soup, baked sausage/lentils and lentil curry links. Its general robots rule did not disallow this endpoint at observation time; content reuse still needs resolution.
- [Good Food native lentil search](https://www.bbcgoodfood.com/search?q=lentil) returned red-lentil squash dhal and spiced carrot/lentil soup links, plus a `/premium/` candidate. The search request preceded the robots check. Because `/search*` is disallowed there, **do not propose automating that endpoint** despite the HTTP 200.

Category/collection links or sitemaps are possibilities, not validated unrestricted APIs. No free general-purpose search API or reliable search-results scraper was established. Browser search links or user-supplied URLs are an honest temporary fallback but would reduce automation; they do not satisfy unattended discovery by themselves. Saved successful recipes can support reuse without turning V1 into a fixed catalog.

## Reproducible validation and next acceptance protocol

To repeat page checks without dependencies, request the original URLs with `urllib.request.Request`, the user agent above and a 20-second timeout; record status/final URL before parsing. Extract `script[type="application/ld+json"]`, parse each JSON block, traverse objects/arrays including `@graph`, and locate `@type` Recipe (string or array). Record `author`, `recipeYield`, times and ingredient/instruction counts; recursively flatten HowToSection/HowToStep only with order preserved. Do not rerun a publisher's restricted scraper path just to reproduce this report. Temporary checker scripts live outside the worktree and are not part of the commit.

The first attempt inside the restricted sandbox produced DNS failures for all four hosts. Narrow escalated network checks then gave the 200/200/403 results above; sandbox failure therefore was not treated as publisher denial. No account sessions or browser login were used for recipe sites. At most one actual network recipe fetch per tested publisher was made after escalation; 403 was not retried.

Before declaring source-backed recipe discovery implemented:

1. Establish an approved access/reuse basis for at least two chosen sites, including local storage and provider transfer. Record the precise scope rather than marking all scraped content licensed.
2. Run 10 representative discovery requests, including vegetarian, dairy-light, batch dinner and unsuitable constraints; require new live candidates rather than a hardcoded catalog. Record latency, tool failures and candidate rejection reasons. Search testing so far is **1/1 completed**, not a performance estimate.
3. Validate at least 3 recipes per approved site against the original page: author/source URL, base yield, all ingredient quantities and alternatives, steps, notes and prep/cook time. HTTP/JSON-LD success here is **2/3 actual recipe fetches**; Budget Bytes is not counted as an actual network fetch.
4. Reject incomplete/non-recipe/premium/gateway pages. Fail visibly for 403, timeout, absent schema and source disagreement. No invented completion. Keep optional sides/toppings and unquantified ingredients explicit; Good Food's method includes water not represented as a simple ingredient line, illustrating why JSON-LD alone is insufficient.
5. Persist original URL, publisher/author, fetched time, source version/hash, original fields, parser version and approved extracted record. Cache only within the resolved permission scope. Keep the base recipe immutable; label deterministic serving scaling separately. Treat page text as untrusted data, and prevent arbitrary redirects/private-network fetches.
6. Test six requested portions from a four-serving recipe, source yield ranges, fractional household coverage and replacement of one meal without altering the other. Source uncertainty must block exact grocery totals instead of creating false precision.
7. Exercise quota/consent/session failures without losing saved work or switching billing. Verify source citations remain visible after reload and replacement. Recheck preview documentation and site policies before implementation.

Remaining blockers: no permission-cleared multi-site importer; no end-to-end source extraction/selection/list proof; full hosted retrieval not tested; search quota/latency/reliability unknown; no entitlement guarantee beyond the tested account/model; Serious Eats HTTP/terms unresolved; Budget Bytes automation explicitly restricted; Good Food native search disallowed by robots and persistence/provider-transfer scope unclear; RecipeTin full-content sharing scope unclear. These gaps limit product claims, not the demonstrated fact that subscription-backed domain-filtered discovery worked.
