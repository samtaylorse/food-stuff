# Recipe discovery and retrieval

Type: research
Status: resolved
Resolved by: recipe-discovery research agent; reviewed by parent
Parent: ../map.md

## Question

What practical V1 route can discover complete, verifiable recipes on demand across a small set of recipe websites using the selected local subscription architecture?

Investigate first-party sites for variety, metadata, yields, ingredients, instructions, structured recipe data, retrieval obstacles, and published access/reuse constraints. Separate linking, extraction, and faithful concise display. Verify search/retrieval support in the selected subscription inference route; distinguish model suggestions from retrieved evidence. Compare minimal app-side retrieval/search if needed without introducing unapproved paid services. Recommend a bounded approach and concrete validation examples. Do not build an importer or substitute a fixed catalog for live discovery.

## Answer

One real Responses request using the existing Plus grant and account-visible `gpt-6.1-sol` completed hosted `web_search` restricted to `bbcgoodfood.com`. The stream reached `response.completed`; the correct original recipe URL and yield were returned, and all twelve reported source URLs matched that domain or subdomains. No new login or separate API billing was configured. This proves one domain-filtered discovery request for this account/model, not general reliability, unlimited use, or full recipe retrieval.

Separate ordinary HTTP checks retrieved Recipe JSON-LD from one RecipeTin Eats recipe and one Good Food recipe; Serious Eats returned 403. Research-browser readability was not treated as proof of ordinary app access. Publisher access/reuse statements differ, and Good Food's native search endpoint is disallowed by its robots rules even though one request returned content. No bypass was attempted.

The recommended next proof is hosted discovery followed by original-page validation, with explicit failure for incomplete sources rather than invented ingredients or steps. The starting source set and retained/displayed content were subsequently selected in [Source selection and recipe display policy](08-source-selection.md); complete extraction/scaling/list correctness remains unproven.

Evidence: **Recipe discovery findings** (`docs/research/RECIPE_DISCOVERY_FINDINGS.md` at commit `b67c5f820529d236795eb3c3ccd7c9a838a8b37e`), committed on `research/recipe-discovery` and pushed without a PR. It includes the sanitized successful request shape, first-party citations, direct HTTP observations, limitations, and a proposed acceptance protocol. Temporary test scripts and credential data are not in the commit.
