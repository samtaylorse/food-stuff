# Shopping handoff version 1

This contract connects the planner's approved shopping list with a separately invoked desktop shopping skill. It runs in ordinary Node TypeScript modules, without a planner, subscription, or grocery session. The public types and runtime validators are in [`src/shopping-handoff/contract.ts`](../src/shopping-handoff/contract.ts); optional local file helpers are in [`files.ts`](../src/shopping-handoff/files.ts). The application workflow remains the authority for approval and revisions.

## Use

Use Node 26.13.1, pinned in `.nvmrc`, with `package.json` allowing compatible Node 26 updates. On nvm-windows, select it with `nvm use 26.13.1`. The TypeScript target is explicitly ES2025. Run `npm ci` and `npm run verify` for the contract completion gate. `npm run validate` checks lint, formatting and TypeScript without rewriting source. `npm test` runs disjoint Vitest unit and integration projects; `npm run test:unit` runs 51 focused contract/digest/validation checks in `tests/unit/shopping-handoff/`, and `npm run test:integration` runs six real filesystem export/import checks in `tests/integration/shopping-handoff/`. Unit test names identify the module and behavior: `contract.approval.test.mjs`, `contract.result.test.mjs`, and `contract.examples.test.mjs`. Both projects include `.test.{ts,mts,js,mjs}` files, run in Node and exclude browser specs. Typechecking remains separate from test execution; `npm run test:watch` explicitly enables watch mode.

`npm run build` emits ESM JavaScript and declarations to ignored `dist/`, separate from the later application build in `build/`. At this contract-only stage `verify` runs validation, both fast suites and the module build. There is no application/browser flow yet: the planner task must add the real Playwright suite and its E2E command to `verify`; there is no passing E2E placeholder. No UI, database, browser, or live credentials are needed. `npm run format`, `npm run lint:fix`, and `npm run fix` intentionally edit source; `fix` formats before applying lint fixes. Inspect fixes and rerun validation afterward. Private and generated directories are excluded from lint/format checks.

```ts
import { readFile } from 'node:fs/promises';
import {
  parseApproval, pinRun, assertCurrentApproval, parseShoppingResult,
} from './src/shopping-handoff/contract.js';
import { exportApproval, exportRunResult } from './src/shopping-handoff/files.js';

const approved = parseApproval(JSON.parse(await readFile(approvedPath, 'utf8')));
const pin = pinRun(approved, runId, new Date().toISOString());
// Save approved input + pin in private run storage. Verify provenance/currentness
// using the selected planner approval/run controls before any real cart effects.
assertCurrentApproval(pin, currentApprovalFromAuthority);
const result = parseShoppingResult(resultData, { pin, currentApproval: currentApprovalFromAuthority });
// Persist result + current-state check together in the application transaction.

await exportApproval(privateExportDirectory, approved);
// The skill may publish a stopped historical run against its original approval.
await exportRunResult(privateResultDirectory, result, { pin, approval: approved });
```

`sealApproval(unsignedData)` validates producer data and calculates its digest. Call it only after the application workflow has captured a real approval; it neither establishes approval provenance nor grants authority. `parseApproval` accepts only a fully sealed approval. Both return validated copies. Use `.js` import suffixes from TypeScript under NodeNext; standalone consumers can import the emitted `dist/shopping-handoff/*.js` modules. These host-side modules use Node crypto; UI code should consume serialized results and type-only imports.

The file helpers are production handoff functions shared as library code. The planner calls `exportApproval` to create the input file. A separately invoked shopping skill reads and validates that file, runs independently, and calls `exportRunResult` to publish its report. The planner later calls `readShoppingResult` to validate the report before saving it. These calls occur in separate executions; sharing the module does not require shared memory, a database connection or a running planner during shopping. The private `publishImmutableJson` helper centralizes complete-file publication for the two exports and accepts only validated approval/result types.

Production TypeScript under `src/` uses typescript-eslint's `recommendedTypeChecked` rules, including unsafe-`any` flow checks, in addition to the recommended rules and strict compiler checks. Public validators accept `unknown` because imported data has not been validated. Internal functions use concrete domain or JSON types once the shape is known. Prefer fixing types or narrowing values; when a rule needs an exception, use a targeted inline suppression with a concrete reason. No blanket `unknown` ban or file-wide type-safety suppression is needed.

## Approved shopping list

All objects reject unknown fields. Every listed field is required unless identified as optional. Version 1 supports CAD only. IDs are opaque, stable, case-sensitive strings of 1–100 ASCII letters, digits, hyphens, or underscores, beginning with a letter or digit. Revisions/configuration counts are positive safe integers. Times are UTC ISO 8601 with exactly three fractional digits, for example `2026-11-15T12:00:00.000Z`. Text is nonblank, at most 2,000 characters, and is preserved without trimming. Inputs must contain JSON values, not `undefined`, NaN, or Infinity.

| Field | Meaning |
| --- | --- |
| `schemaVersion`, `kind` | Exactly `1`, `approved-shopping-list` |
| `approvalId`, `approvedAt` | Stable identity and captured time of this saved approval |
| `shoppingList.shoppingListId`, `shoppingList.revision`, `shoppingList.weekId` | Stable list/week identity and the exact approved revision |
| `shoppingList.configuration` | Snapshot of `householdSize`, `batchRecipeCount`, `individualPortionsPerRecipe` |
| `shoppingList.currency`, `shoppingList.constraints` | `CAD` and explicit household purchasing constraints |
| `shoppingList.recipes` | Nonempty source references: unique `recipeVersionId`, `title`, `source` (`reference`, optional `publisher`/`author`), and `sourceDigest` |
| `shoppingList.ingredients` | Nonempty consolidated rows with unique `ingredientId`, `name`, `constraints`, `requirements`, `stock`, `purchase` |
| `digest` | `sha256:` followed by 64 lowercase hexadecimal digits |

Recipe version identities refer to immutable sourced records owned by the planner; `sourceDigest` is the captured source record's digest, not a claim that this module retrieves or verifies a website. A requirement has a known `recipeVersionId` and `amount`; several requirements can refer to one shared ingredient. Stable ingredient IDs survive revisions for the same consolidated ingredient. A materially different ingredient/basis gets a distinct identity. Revisions change for material edits, including configuration, recipes, effective stock and purchase choices. Reapproval receives a fresh approval ID/time; an export preserves the original approval identity/time.

A saved approval records the user's explicit approval of one exact shopping-list revision. Approving revision 3 creates approval A. Editing the shopping list into revision 4 means A cannot authorize revision 4; the user must approve the changed version. Exporting revision 3 again preserves A without creating another approval. `shoppingList.weekId` links this approved version to its saved dinner-planning week. This module validates it and binds it in the digest; it does not calculate dates or use that field to determine currentness. Currentness depends on the saved shopping-list/approval identity, revision and digest.

Amounts are a discriminated union:

| `kind` | Fields |
| --- | --- |
| `exact` | `value`, `unit`, `basis`, optional `preparation` |
| `approximate` | Same fields, plus a nonblank `explanation` |
| `range` | `min`, `max`, `unit`, `basis`, optional `preparation`; `max >= min` |
| `unquantified` | `description` only; no invented numeric quantity or unit |

Numbers must be finite, nonnegative, and no larger than the maximum safe integer. Units are `g`, `kg`, `ml`, `l`, `count`, `tsp`, `tbsp`, `cup`, `pack`. Basis is `dry`, `cooked`, `net`, `drained`, `as-sold`, or explicitly `unspecified`. This module does no arithmetic/conversions or stock derivation: preserve the workflow's confirmed measurement basis and estimates. Export one selected normalized measure for a source requirement; equivalent source measurements must not become additive requirements. Recipe provenance retains the source for explanation. Mixed-unit conversions require a visible basis and user confirmation in the producing workflow; retain that basis in preparation/explanation/purchase note. Separate incompatible requirements instead of silently converting dry/cooked or net/drained amounts.

`stock.kind` is `unknown` with `presence: observed | unreported`, `amount` with an `amount`, `enough` with `confirmedFor`, `assumed` with `reason`, or `buy-full` with no other fields. Observed presence never implies usable amount. Enough is scoped to the confirmed requirement; the planner must recheck it when need increases. Buy-full does not assert zero stock. Shared stock is deducted once by the producing workflow, with approximation labels retained in purchase targets.

`purchase.kind` is `covered` with a `reason`, or `buy` with a `target` amount, `reason: need | pack-rounding | stock-up | user-edit`, and explanatory `note`. Numeric buy targets must be positive (a range must have positive maximum). Covered ingredients stay in the payload. A suitable-pack target for a to-taste extra can remain unquantified. Normal pack surplus and an intentional stock-up are distinct approved choices; product records and pack selection belong to issue 09.

## Digest algorithm

Validate the complete approval shape first. Remove only the top-level `digest`. Recursively encode JSON objects with keys sorted by UTF-16 code-unit order, preserving arrays in order. Use ECMAScript `JSON.stringify` string/number/boolean/null spelling, without formatting whitespace or a trailing newline. Hash those UTF-8 bytes with SHA-256; prefix the lowercase hexadecimal result with `sha256:`. Do not trim strings or normalize Unicode. Object key order and JSON-file formatting are immaterial; array order and every approved field, including IDs, approval time, configuration, constraints and source references, are bound. File helpers may pretty-print JSON without changing the digest. Independent implementations must match ECMAScript numeric/string spelling, including `-0` as `0`.

The unsigned synthetic [`approval-input.json`](../examples/shopping-handoff/approval-input.json) has digest `sha256:8d9fbbde0ce4e122e1624f611027e23c9c14d16b6899e1b59c44442912dbc1af`, also checked independently using Python's SHA-256 against sorted compact JSON for this integer-only fixture. Unsupported versions and fields fail closed; a version change must update both consumers and examples.

A digest detects content changes. Anyone can recompute it; it is not a signature or proof of trusted user authorization. Approval provenance/currentness must come from the trusted application workflow or an explicitly selected, approved local handoff. **All committed examples are synthetic and authorize no real cart changes.** Do not infer permission from passing validation.

## Run pin and result

A pin contains `schemaVersion: 1`, a unique `runId`, `startedAt`, and `approval: { approvalId, shoppingListId, revision, digest }`. A run begins no earlier than approval. Save the complete validated input and this pin before work. Reusing the same approval for another invocation uses a new run ID; retrying publication/import of the same terminal result preserves its run ID and content. A run ID must never be rebound to another approval. The authoritative run registry must enforce that invariant; no private reconciliation ledger is defined here.

A result contains exactly `schemaVersion: 1`, `kind: shopping-result`, `runId`, the exact `approval` identity from the pin, `finishedAt`, `status`, nonblank `reason`, `costs`, `gaps`, and `pendingReplacements`. Completion must not precede run start.

| Status | Meaning |
| --- | --- |
| `ready-for-review` | Task targets observed as satisfied; no unresolved gaps or pending replacements. User review and checkout remain. Unknown charges may remain explicit. |
| `incomplete` | Useful work may exist; shopping decisions or unmet targets remain. |
| `failed` | Capability/validation/execution failure; reason explains the limit. Never implies rollback of prior effects. |
| `interrupted` | Work stopped or outcome uncertain; inspect before retrying. |
| `superseded` | A newer plan/approval is known; stop applying this old input. |

For invalid/draft input that cannot be pinned, fail before effects and report a local validation error; do not fabricate an approval-linked result. When input is valid but browser capability is missing, return a pinned `failed` result. When actions have uncertain outcomes, use `interrupted` or `incomplete` with the limitation; an attempted click is not proof of completion. No result places an order or certifies checkout.

`costs` contains `currency: CAD`, `observedAt` (UTC time or null), nullable safe-integer `itemsMinor`, `feesMinor`, `taxesMinor`, `knownTotalMinor`, `unknownCharges`, and textual `conditions`. Minor units are cents. Values describe the selected task basket, with applicable observed store charges; unrelated cart merchandise is excluded. A component is either fully known or null; partial components stay null and their limitation can be explained in `conditions`. Null never means zero. `unknownCharges` must name exactly the null components using `items`, `fees`, `taxes`, without duplicates. `knownTotalMinor` sums known components, or is null when none are known. A known component requires an observation time, no later than result completion. Known zero charges use `0`. Never label a partial known total as the delivered total. Include applicable fee/tax limitations and promotion conditions; apply conditional savings to the item cost only after their conditions are verified, otherwise leave them unapplied and explain. Detailed store comparison, discounts and product records remain private to issue 09.

Each gap has an approved `ingredientId`, `reason: unavailable | quantity-uncertain | ownership-uncertain | other`, and `detail`. A pending replacement has an approved `ingredientId`, a textual `proposal`, and `reason`. These are summaries for a gathered user review; a proposal does not authorize changing the sourced recipe or constraints. No basket product IDs, browser execution state, baseline quantities, or reconciliation ledger are part of this format.

`parseRunResult(data, { pin, approval })` validates against the original pinned approval, including historical results. `parseShoppingResult(data, { pin, currentApproval })` is the application import gate: it rejects mismatched run/list/approval IDs, revision, digest, currency, unknown ingredient references, stale input and malformed results. Supply current approval from authoritative saved state and pin from the saved run registry, never from the result itself. If a material edit has left the current draft unapproved, supply no current approval and reject import. Historical storage/display must never certify the current shoppingList.

## Atomic files and import protocol

1. Capture approval and immutable content in the application transaction. Export that captured version through `exportApproval`; never calculate a new approval during export. The projection is named `approval.r<revision>.<identityKey>.json`, where `identityKey` is lowercase SHA-256 hex of UTF-8 `JSON.stringify([shoppingListId, revision, approvalId])`. Do not overwrite an existing identity with different content.
2. The file helpers create a private-mode short unique temporary sibling (`.handoff.<UUID>.tmp`, `wx`), write and sync the complete bytes, close it, then publish with an atomic hard link that cannot replace an existing destination. Identical repeated publication succeeds; conflicting bytes fail and leave the existing file intact. Temporary files are removed on ordinary success/failure. Result publication uses `result.<runKey>.json`, where `runKey` is lowercase SHA-256 hex of UTF-8 `JSON.stringify([runId])`, with the same rules. These bounded, lowercase identity keys preserve case-sensitive IDs on Windows and avoid reserved device names or long basenames. They hash identity only, so different content under the same identity still conflicts. Callers should use the returned path; filenames are projections, never authority. No partially written destination is exposed. Directory power-loss durability is not promised; a process crash can leave an orphan `.tmp`. Readers ignore temporary files. On filesystems without atomic hard links, fail and preserve prior exports; do not fall back to copying into the destination.
3. Use private, caller-owned paths on one local filesystem. POSIX mode arguments do not establish Windows ACL protection; the host must provision access controls. The helpers do not change inherited directory ACLs or defend a directory writable by unrelated processes.
4. A convenience pointer may locate an export before pinning. Resolve/read it once; subsequent work uses the saved content and pin. A changed pointer cannot silently replace active input. Before effects and at available approval/run checkpoints, use authoritative current state or explicit supersession/cancellation signals. On known change, stop and report superseded; start a new run only with newly approved input. A disconnected file consumer cannot discover an uncommunicated plan change: issue 09 must make available controls and this limit explicit, without claiming a watcher exists.
5. `readShoppingResult(path, context)` reads once and returns a fully validated copy, without changing application state. Truncated/invalid/stale input fails as a whole. In issue 08, read/parse outside a transaction if convenient, then **inside one application transaction** reload the current approval and registered pin, run `parseShoppingResult` against those values, and insert the entire result. Make `(runId)` unique: identical duplicate import is a no-op; different content for the same terminal run is a conflict. If any check/write fails, roll back and retain the last valid saved state. Checking once before a transaction cannot prevent a concurrent revision change. This ticket supplies validators/file projections; the database transaction and durable run registry are integration obligations for issues 08/09.

Keep credentials, browser state, account IDs, precise addresses, photos and actual shopping records out of payloads/examples, source control and ordinary logs. Strict schemas exclude extra private fields; free text/reference strings still require producer discipline and are not a privacy scanner. Do not log rejected payloads or full validation errors containing personal data.

## Synthetic examples and verification

[`examples/shopping-handoff/`](../examples/shopping-handoff/) contains unsigned producer input, sealed approvals at revisions 1 and 2, two pins for repeat runs against revision 1, a minimal incomplete result and a repeat result ready for review. The revised approval deliberately keeps ingredient IDs while changing the broccoli target and stock-up choice; both revision-1 results must be rejected for it. Shared onions, approximate stock, unquantified herbs, covered salt, normal broccoli surplus and intentional rice stock-up appear in revision 1. No recipe cooking instructions or product/cart records are invented.

Tests cover the public modules and real isolated local file publication, including concurrent exports, collisions, failed writes and partial imports. Atomic hard links are blocked by this environment's filesystem sandbox (`EPERM`); the complete suite was verified outside that restriction on the same Windows checkout. This is an environment constraint, not a weakened test or a copy fallback. There is no runnable planner/browser flow in this issue; browser regression and live-cart checks do not apply.

Zod 4.6.7 and Vitest 5.1.0 use the verified stable releases. Shared ESLint/Prettier tooling settings and pinned versions were adopted from reviewed commit `d02e7475fde6c18bd4df15715f8b995d1cbe56c5`, without importing the app-only dependencies, route generation, build or E2E scripts. The contract retains its Zod dependency and ordinary TypeScript module build/typecheck. TypeScript is intentionally pinned to 6.0.3: the approved `typescript-eslint` 8.72.2 peer range is `>=4.8.4 <6.1.0`, so TypeScript 7 is incompatible with the shared lint tooling. `@types/node` 26.6.6 follows the verified Node 26 major. The contract tooling is verified on Node 26.13.1/npm 11.20.0. Exact direct versions and the regenerated `package-lock.json` pin the install. The planner's native SQLite dependency and real browser flow require their own Node 26 verification when integrated; this contract suite does not exercise them. Later application tickets add their own compatible dependencies without making this contract a full application scaffold.
