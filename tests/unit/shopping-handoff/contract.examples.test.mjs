import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  parseApproval,
  parseShoppingResult,
  pinRun,
} from "../../../src/shopping-handoff/contract.ts";

const load = (name) =>
  JSON.parse(
    readFileSync(
      new URL(`../../../examples/shopping-handoff/${name}`, import.meta.url),
      "utf8",
    ),
  );

test("published synthetic examples validate independently and older results cannot certify the revised approval", () => {
  const original = parseApproval(load("approval-v1.json"));
  const revised = parseApproval(load("approval-v2.json"));
  assert.equal(revised.shoppingList.revision, 2);
  assert.deepEqual(
    original.shoppingList.ingredients.map((i) => i.ingredientId),
    revised.shoppingList.ingredients.map((i) => i.ingredientId),
  );
  for (const [pinFile, resultFile] of [
    ["run-1.json", "result-incomplete.json"],
    ["run-2.json", "result-repeat.json"],
  ]) {
    const pin = load(pinFile);
    assert.deepEqual(pinRun(original, pin.runId, pin.startedAt), pin);
    const result = load(resultFile);
    assert.deepEqual(
      parseShoppingResult(result, { pin, currentApproval: original }),
      result,
    );
    assert.throws(
      () => parseShoppingResult(result, { pin, currentApproval: revised }),
      /superseded/,
    );
  }
});
