import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  sealApproval,
  pinRun,
  parseShoppingResult,
  parseRunResult,
  assertCurrentApproval,
} from "../../../src/shopping-handoff/contract.ts";

const input = JSON.parse(
  readFileSync(
    new URL(
      "../../../examples/shopping-handoff/approval-input.json",
      import.meta.url,
    ),
    "utf8",
  ),
);
const approval = sealApproval(input);
const pin = pinRun(approval, "run-demo-1", "2026-11-15T12:01:00.000Z");
const result = {
  schemaVersion: 1,
  kind: "shopping-result",
  runId: pin.runId,
  approval: pin.approval,
  finishedAt: "2026-11-15T12:02:00.000Z",
  status: "incomplete",
  reason: "Unresolved shopping decisions",
  costs: {
    currency: "CAD",
    observedAt: "2026-11-15T12:02:00.000Z",
    itemsMinor: 1250,
    feesMinor: null,
    taxesMinor: null,
    knownTotalMinor: 1250,
    unknownCharges: ["fees", "taxes"],
    conditions: [],
  },
  gaps: [
    {
      ingredientId: "herbs",
      reason: "unavailable",
      detail: "No suitable pack observed",
    },
  ],
  pendingReplacements: [
    {
      ingredientId: "rice",
      proposal: "A different grain",
      reason: "Would change the sourced recipe",
    },
  ],
};

test("consumer accepts a minimal incomplete result only against its pinned run and current approval", () => {
  assert.deepEqual(
    parseShoppingResult(result, { pin, currentApproval: approval }),
    result,
  );
  const revised = structuredClone(input);
  revised.shoppingList.revision = 2;
  revised.approvalId = "approval-demo-2";
  revised.approvedAt = "2026-11-15T12:03:00.000Z";
  revised.shoppingList.ingredients[1].purchase.target.value = 1000;
  assert.throws(
    () =>
      parseShoppingResult(result, {
        pin,
        currentApproval: sealApproval(revised),
      }),
    /current|superseded/i,
  );
});

test("a repeated approval has a new run ID, while retrying a terminal result is idempotent", () => {
  const nextPin = pinRun(approval, "run-demo-2", "2026-11-15T12:01:00.000Z");
  assert.deepEqual(nextPin.approval, pin.approval);
  assert.deepEqual(
    parseShoppingResult(result, { pin, currentApproval: approval }),
    parseShoppingResult(result, { pin, currentApproval: approval }),
  );
  assert.throws(
    () =>
      parseShoppingResult(result, { pin: nextPin, currentApproval: approval }),
    /run/,
  );
});

test("known supersession stops a pinned run and keeps its historical report separately valid", () => {
  const revised = structuredClone(input);
  revised.shoppingList.revision = 2;
  const current = sealApproval(revised);
  assert.throws(() => assertCurrentApproval(pin, current), /superseded/);
  const stopped = {
    ...result,
    status: "superseded",
    reason: "A newly approved revision is available",
  };
  assert.equal(parseRunResult(stopped, { pin, approval }).status, "superseded");
  assert.throws(
    () => parseShoppingResult(stopped, { pin, currentApproval: current }),
    /superseded/,
  );
  assert.throws(() =>
    parseShoppingResult(result, { pin, currentApproval: null }),
  );
});

test("a complete cart may await review with unknown charges, but no unresolved shopping decisions", () => {
  const ready = {
    ...result,
    status: "ready-for-review",
    reason: "Observed task quantities match approved targets",
    gaps: [],
    pendingReplacements: [],
  };
  const parsed = parseShoppingResult(ready, { pin, currentApproval: approval });
  assert.equal(parsed.costs.knownTotalMinor, 1250);
  assert.deepEqual(parsed.costs.unknownCharges, ["fees", "taxes"]);
});

test("failure before any cost observation preserves unknown rather than inventing a zero total", () => {
  const failed = {
    ...result,
    status: "failed",
    reason: "Required browser unavailable",
    gaps: [],
    pendingReplacements: [],
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
  };
  assert.deepEqual(
    parseShoppingResult(failed, { pin, currentApproval: approval }),
    failed,
  );
});

for (const [name, mutate] of [
  [
    "unsupported result version",
    (r) => {
      r.schemaVersion = 2;
    },
  ],
  [
    "wrong approval ID",
    (r) => {
      r.approval.approvalId = "wrong";
    },
  ],
  [
    "wrong list ID",
    (r) => {
      r.approval.shoppingListId = "wrong";
    },
  ],
  [
    "wrong revision",
    (r) => {
      r.approval.revision++;
    },
  ],
  [
    "wrong digest",
    (r) => {
      r.approval.digest = `sha256:${"f".repeat(64)}`;
    },
  ],
  [
    "wrong run ID",
    (r) => {
      r.runId = "wrong";
    },
  ],
  [
    "missing identity",
    (r) => {
      delete r.approval;
    },
  ],
  [
    "wrong currency",
    (r) => {
      r.costs.currency = "USD";
    },
  ],
  [
    "false known total",
    (r) => {
      r.costs.knownTotalMinor = 0;
    },
  ],
  [
    "silent unknown fees",
    (r) => {
      r.costs.unknownCharges = ["taxes"];
    },
  ],
  [
    "duplicate unknown charges",
    (r) => {
      r.costs.unknownCharges = ["fees", "fees", "taxes"];
    },
  ],
  [
    "unknown reported as known",
    (r) => {
      r.costs.feesMinor = 0;
    },
  ],
  [
    "missing observation time",
    (r) => {
      r.costs.observedAt = null;
    },
  ],
  [
    "negative cost",
    (r) => {
      r.costs.itemsMinor = -1;
    },
  ],
  [
    "fractional minor units",
    (r) => {
      r.costs.itemsMinor = 12.5;
    },
  ],
  [
    "unsafe cost sum",
    (r) => {
      r.costs.itemsMinor = Number.MAX_SAFE_INTEGER;
      r.costs.feesMinor = 1;
      r.costs.knownTotalMinor = Number.MAX_SAFE_INTEGER + 1;
      r.costs.unknownCharges = ["taxes"];
    },
  ],
  [
    "unknown ingredient",
    (r) => {
      r.gaps[0].ingredientId = "missing";
    },
  ],
  [
    "complete with gaps",
    (r) => {
      r.status = "ready-for-review";
      r.pendingReplacements = [];
    },
  ],
  [
    "complete with pending replacement",
    (r) => {
      r.status = "ready-for-review";
      r.gaps = [];
    },
  ],
  [
    "product ledger in app result",
    (r) => {
      r.products = [];
    },
  ],
  [
    "result before run",
    (r) => {
      r.finishedAt = "2026-11-15T12:00:00.000Z";
      r.costs.observedAt = null;
      r.costs.itemsMinor = null;
      r.costs.knownTotalMinor = null;
      r.costs.unknownCharges = ["items", "fees", "taxes"];
    },
  ],
  [
    "observation after result",
    (r) => {
      r.costs.observedAt = "2026-11-15T12:03:00.000Z";
    },
  ],
]) {
  test(`rejects ${name}`, () => {
    const changed = structuredClone(result);
    mutate(changed);
    assert.throws(() =>
      parseShoppingResult(changed, { pin, currentApproval: approval }),
    );
  });
}
