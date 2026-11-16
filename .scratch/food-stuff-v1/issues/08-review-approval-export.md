# 08: Review, approve and export

**What to build:** Review recipe needs against purchases, approve the exact saved shopping-list version, export it for desktop shopping, and import/display a result without letting stale approvals or results certify newer edits.

**Blocked by:** 01: Define the shopping handoff contract; 06: Correct stock and reduce purchases.

**Status:** ready-for-agent

- [ ] Provide covered-first review followed by purchases, comparing ingredient, recipe-required amount and amount to buy. Keep recipe membership legible where useful and allow returning to the editable list.
- [ ] Show advisory grounded shortfalls and clear unexplained excess without per-flag acknowledgement. Missing stock is subtle context, normal pack rounding is allowed, explicit stock-ups are preserved and no blanket twice-the-need threshold is imposed.
- [ ] Cover the agreed examples: 600 g needed with 400 g stock plus 200 g purchase is covered; 500 g needed with 200 g stock plus 100 g purchase is 200 g short; 300 g broccoli versus an unexplained 3 kg purchase deserves attention, while a 500 g bag is ordinary rounding. Preserve approximate labels.
- [ ] Approve atomically against the expected revision, snapshotting the exact configuration, recipes, requirements, stock decisions and purchases. Material edits invalidate approval; navigation, filtering and opening source/details do not. Reload/restart preserves approval history correctly.
- [ ] Export immutable, revision-specific approved artifacts atomically using the contract from ticket 01. Repeated export does not create another approval. No retyping ingredients, hidden credential payload or conflicting editable second database is introduced.
- [ ] Import and persist validated desktop results against their pinned approval identity/revision/digest. Display outcome, known costs, gaps and pending replacements; stale results stay historical and cannot certify the current list. Synthetic results enable completion independently of ticket 09.
- [ ] Tests use real isolated persistence and shared contract validators, covering altered inputs, atomic export, incomplete work/restart, stale results, material-edit invalidation and read-only actions. Playwright covers approval, reload and invalidation in the critical flow.
- [ ] The flow remains usable with no stock input and without photo capture being implemented. Once ticket 07 lands, photo corrections feed the same revision/approval rules without a second approval implementation.
