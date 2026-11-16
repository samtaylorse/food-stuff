# 07: Capture stock from photos

**What to build:** Use photos as the primary stock input and feed extracted observations into the existing correction workflow, with a secondary option to describe stock instead.

**Blocked by:** 06: Correct stock and reduce purchases.

**Status:** ready-for-agent

- [ ] Make image upload the main stock action and text a secondary alternative. Retain one Continue action that permits no stock input and show extracted observations for correction when input is supplied.
- [ ] Validate supported image formats, input size and bounded request handling. Handle invalid files, failed inference and cancellation without replacing valid saved work.
- [ ] Treat image extraction as observations, not confirmed inventory. Visible packaging does not establish usable amount; obscured or unpictured ingredients are not absent. Preserve uncertainty and user corrections.
- [ ] Reuse stock decisions and shopping derivation from ticket 06 rather than implementing a second deduction flow. Apply results only against the intended current revision; late results cannot overwrite corrections.
- [ ] Develop and regress with safe synthetic images/controlled image responses through the same inference interface. Live image verification also requires ticket 03, but its absence does not block implementation or default tests.
- [ ] Keep private images and extracted household data outside Git and ordinary logs, with explicit private runtime paths; committed fixtures contain no personal photos.
- [ ] Extend workflow and Playwright checks for upload, correction, unchanged shopping before confirmation, invalid input, failure recovery and empty-stock Continue. Verify actual rendered input priority with agent browser tools.
