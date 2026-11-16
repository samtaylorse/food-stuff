import { beforeAll, test } from "vitest";
import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import {
  sealApproval,
  parseApproval,
  pinRun,
} from "../../../src/shopping-handoff/contract.ts";
import {
  exportApproval,
  exportRunResult,
  readShoppingResult,
} from "../../../src/shopping-handoff/files.ts";

const input = JSON.parse(
  readFileSync(
    new URL(
      "../../../examples/shopping-handoff/approval-input.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
beforeAll(() =>
  mkdir(resolve("local/issue-01/files-tests"), { recursive: true }),
);

test("concurrent repeated exports publish one complete immutable approval and reject conflicting content", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  const approval = sealApproval(input);
  const paths = await Promise.all(
    Array.from({ length: 8 }, () => exportApproval(directory, approval)),
  );
  assert.equal(new Set(paths).size, 1);
  assert.deepEqual(
    parseApproval(JSON.parse(await readFile(paths[0], "utf8"))),
    approval,
  );
  const changed = structuredClone(input);
  changed.shoppingList.ingredients[0].purchase.note =
    "Different content under the same approval identity";
  await assert.rejects(
    exportApproval(directory, sealApproval(changed)),
    /conflict/i,
  );
  assert.deepEqual(await readdir(directory), [
    "approval.r1.4cc097de8381ef71b47dbc5e6adca69ec1475c8e913ea753ea13febfac4eb78c.json",
  ]);
  assert.deepEqual(
    parseApproval(JSON.parse(await readFile(paths[0], "utf8"))),
    approval,
  );
});

test("failed publication preserves an existing target and removes temporary files", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  // Deterministic real filesystem failure: a directory occupies the destination.
  const name =
    "approval.r1.4cc097de8381ef71b47dbc5e6adca69ec1475c8e913ea753ea13febfac4eb78c.json";
  await mkdir(resolve(directory, name));
  await assert.rejects(exportApproval(directory, sealApproval(input)));
  assert.deepEqual(await readdir(directory), [name]);
});

test("invalid approvals cannot publish anything, including a draft or altered digest", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  await assert.rejects(exportApproval(directory, input));
  const altered = sealApproval(input);
  altered.shoppingList.ingredients[0].name = "Altered";
  await assert.rejects(exportApproval(directory, altered));
  assert.deepEqual(await readdir(directory), []);
});

test("result publication is immutable per run and file import rejects incomplete or stale data", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  const approval = sealApproval(input);
  const pin = pinRun(approval, "run-demo-1", "2026-11-15T12:01:00.000Z");
  const result = {
    schemaVersion: 1,
    kind: "shopping-result",
    runId: pin.runId,
    approval: pin.approval,
    finishedAt: "2026-11-15T12:02:00.000Z",
    status: "failed",
    reason: "Browser capability unavailable",
    costs: {
      currency: "CAD",
      observedAt: null,
      itemsMinor: null,
      feesMinor: null,
      taxesMinor: null,
      knownTotalMinor: null,
      unknownCharges: ["items", "fees", "taxes"],
      conditions: [],
    },
    gaps: [],
    pendingReplacements: [],
  };
  const path = await exportRunResult(directory, result, { pin, approval });
  assert.equal(
    await exportRunResult(directory, result, { pin, approval }),
    path,
  );
  assert.deepEqual(
    await readShoppingResult(path, { pin, currentApproval: approval }),
    result,
  );
  await assert.rejects(
    exportRunResult(
      directory,
      { ...result, reason: "Different terminal report" },
      { pin, approval },
    ),
    /conflict/,
  );
  const changed = structuredClone(input);
  changed.shoppingList.revision = 2;
  await assert.rejects(
    readShoppingResult(path, { pin, currentApproval: sealApproval(changed) }),
    /superseded/,
  );
  const partial = resolve(directory, "partial.json");
  await writeFile(partial, '{"schemaVersion":1,');
  await assert.rejects(
    readShoppingResult(partial, { pin, currentApproval: approval }),
    SyntaxError,
  );
  assert.deepEqual(
    await readShoppingResult(path, { pin, currentApproval: approval }),
    result,
  );
});

test("all accepted ID/revision limits can be exported and reread on the local filesystem (R01)", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  const maximum = structuredClone(input);
  maximum.shoppingList.shoppingListId = "l".repeat(100);
  maximum.approvalId = "a".repeat(100);
  maximum.shoppingList.revision = Number.MAX_SAFE_INTEGER;
  const approval = sealApproval(maximum);
  const path = await exportApproval(directory, approval);
  assert.deepEqual(
    parseApproval(JSON.parse(await readFile(path, "utf8"))),
    approval,
  );
  assert.equal((await readdir(directory)).length, 1);
});

test("case-sensitive list, approval and run identities coexist on case-insensitive filesystems (R02)", async ({
  onTestFinished,
}) => {
  const directory = await mkdtemp(
    resolve("local/issue-01/files-tests/export-"),
  );
  onTestFinished(() => rm(directory, { recursive: true, force: true }));
  const paths = [];
  for (const [shoppingListId, approvalId] of [
    ["list-demo", "approval-demo-1"],
    ["List-demo", "approval-demo-1"],
    ["list-demo", "Approval-demo-1"],
  ]) {
    const changed = structuredClone(input);
    changed.shoppingList.shoppingListId = shoppingListId;
    changed.approvalId = approvalId;
    const approval = sealApproval(changed);
    const path = await exportApproval(directory, approval);
    paths.push(path);
    assert.deepEqual(
      parseApproval(JSON.parse(await readFile(path, "utf8"))),
      approval,
    );
  }
  const approval = sealApproval(input);
  for (const runId of ["run-demo", "Run-demo"]) {
    const pin = pinRun(approval, runId, "2026-11-15T12:01:00.000Z");
    const result = {
      schemaVersion: 1,
      kind: "shopping-result",
      runId,
      approval: pin.approval,
      finishedAt: "2026-11-15T12:02:00.000Z",
      status: "failed",
      reason: "Synthetic capability failure",
      costs: {
        currency: "CAD",
        observedAt: null,
        itemsMinor: null,
        feesMinor: null,
        taxesMinor: null,
        knownTotalMinor: null,
        unknownCharges: ["items", "fees", "taxes"],
        conditions: [],
      },
      gaps: [],
      pendingReplacements: [],
    };
    const path = await exportRunResult(directory, result, { pin, approval });
    paths.push(path);
    assert.deepEqual(
      await readShoppingResult(path, { pin, currentApproval: approval }),
      result,
    );
  }
  assert.equal(new Set(paths.map((p) => p.toLowerCase())).size, 5);
  assert.equal((await readdir(directory)).length, 5);
});
