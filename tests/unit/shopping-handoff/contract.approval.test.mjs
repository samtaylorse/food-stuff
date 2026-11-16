import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  sealApproval,
  parseApproval,
} from "../../../src/shopping-handoff/contract.ts";

export const input = JSON.parse(
  readFileSync(
    new URL(
      "../../../examples/shopping-handoff/approval-input.json",
      import.meta.url,
    ),
    "utf8",
  ),
);

test("an approved list preserves shared needs, approximate stock, unquantified extras, covered items and purchase intent", () => {
  const approval = parseApproval(sealApproval(input));
  assert.deepEqual(approval.shoppingList, input.shoppingList);
  assert.equal(approval.approvalId, "approval-demo-1");
  assert.match(approval.digest, /^sha256:[a-f0-9]{64}$/);
});

test("content integrity detects even whitespace edits rather than normalizing the payload", () => {
  const changed = sealApproval(input);
  changed.shoppingList.ingredients[0].name += " ";
  assert.throws(() => parseApproval(changed), /digest/);
});

test("module producers cannot seal non-JSON values that would change on export", () => {
  const invalid = structuredClone(input);
  invalid.shoppingList.recipes[0].source.author = undefined;
  assert.throws(() => sealApproval(invalid));
});

test("digest has an independently calculated vector and ignores object key order, not array order", () => {
  // Python hashlib + json.dumps(sort_keys=True, separators=(',', ':'), ensure_ascii=False).
  assert.equal(
    sealApproval(input).digest,
    "sha256:8d9fbbde0ce4e122e1624f611027e23c9c14d16b6899e1b59c44442912dbc1af",
  );
  function reverseKeys(value) {
    if (Array.isArray(value)) return value.map(reverseKeys);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .reverse()
          .map(([k, v]) => [k, reverseKeys(v)]),
      );
    return value;
  }
  const approval = sealApproval(input);
  assert.deepEqual(parseApproval(reverseKeys(approval)), approval);
  approval.shoppingList.ingredients.reverse();
  assert.throws(() => parseApproval(approval), /digest/);
});

for (const [name, mutate] of [
  [
    "unsupported version",
    (a) => {
      a.schemaVersion = 2;
    },
  ],
  [
    "draft instead of approval",
    (a) => {
      a.kind = "draft-shopping-list";
    },
  ],
  [
    "missing approval time",
    (a) => {
      delete a.approvedAt;
    },
  ],
  [
    "missing approval ID",
    (a) => {
      delete a.approvalId;
    },
  ],
  [
    "missing digest",
    (a) => {
      delete a.digest;
    },
  ],
  [
    "extra private data field",
    (a) => {
      a.credentials = "synthetic-forbidden";
    },
  ],
  [
    "nested browser state",
    (a) => {
      a.shoppingList.ingredients[0].browserState = {};
    },
  ],
  [
    "negative quantity",
    (a) => {
      a.shoppingList.ingredients[0].purchase.target.value = -1;
    },
  ],
  [
    "non-finite quantity",
    (a) => {
      a.shoppingList.ingredients[0].purchase.target.value = Infinity;
    },
  ],
  [
    "string quantity",
    (a) => {
      a.shoppingList.ingredients[0].purchase.target.value = "300";
    },
  ],
  [
    "zero buy target",
    (a) => {
      a.shoppingList.ingredients[0].purchase.target.value = 0;
    },
  ],
  [
    "reversed range",
    (a) => {
      a.shoppingList.ingredients[2].requirements[0].amount.min = 500;
    },
  ],
  [
    "invented amount on unquantified extra",
    (a) => {
      a.shoppingList.ingredients[3].purchase.target.value = 50;
    },
  ],
  [
    "duplicate ingredient",
    (a) => {
      a.shoppingList.ingredients.push(a.shoppingList.ingredients[0]);
    },
  ],
  [
    "duplicate recipe version",
    (a) => {
      a.shoppingList.recipes.push(a.shoppingList.recipes[0]);
    },
  ],
  [
    "unknown recipe reference",
    (a) => {
      a.shoppingList.ingredients[0].requirements[0].recipeVersionId = "missing";
    },
  ],
  [
    "unsafe revision",
    (a) => {
      a.shoppingList.revision = Number.MAX_SAFE_INTEGER + 1;
    },
  ],
  [
    "non-UTC timestamp",
    (a) => {
      a.approvedAt = "2026-11-15T12:00:00.000+01:00";
    },
  ],
]) {
  test(`rejects ${name}`, () => {
    const approval = sealApproval(input);
    mutate(approval);
    assert.throws(() => parseApproval(approval));
    // Digest rejection alone must not hide an invalid schema in unsigned producer data.
    const unsigned = { ...approval };
    delete unsigned.digest;
    if (!["missing digest"].includes(name))
      assert.throws(() => sealApproval(unsigned));
  });
}

test("changes to revision, approval evidence, configuration, sources, stock or constraints change the digest", () => {
  const original = sealApproval(input);
  for (const mutate of [
    (a) => {
      a.approvalId = "approval-demo-other";
    },
    (a) => {
      a.approvedAt = "2026-11-15T12:00:01.000Z";
    },
    (a) => {
      a.shoppingList.revision = 2;
    },
    (a) => {
      a.shoppingList.configuration.householdSize = 3;
    },
    (a) => {
      a.shoppingList.recipes[0].source.reference += "/changed";
    },
    (a) => {
      a.shoppingList.constraints.push("Vegetarian");
    },
    (a) => {
      a.shoppingList.ingredients[0].stock.amount.value = 100;
    },
  ]) {
    const changed = structuredClone(input);
    mutate(changed);
    assert.notEqual(sealApproval(changed).digest, original.digest);
  }
});
