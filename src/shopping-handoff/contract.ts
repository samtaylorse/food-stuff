import { createHash } from "node:crypto";
import { z } from "zod";

const text = z
  .string()
  .min(1)
  .max(2000)
  .refine((s) => s.trim().length > 0, "Text must not be blank");
const id = z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,99}$/);
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const positiveInteger = integer.min(1);
const digest = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const time = z.iso.datetime({ precision: 3 });
const measure = {
  unit: z.enum(["g", "kg", "ml", "l", "count", "tsp", "tbsp", "cup", "pack"]),
  basis: z.enum(["dry", "cooked", "net", "drained", "as-sold", "unspecified"]),
  preparation: text.optional(),
};
const value = z.number().finite().nonnegative().max(Number.MAX_SAFE_INTEGER);

const amountSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("exact"), value, ...measure }),
  z.strictObject({
    kind: z.literal("approximate"),
    value,
    ...measure,
    explanation: text,
  }),
  z
    .strictObject({
      kind: z.literal("range"),
      min: value,
      max: value,
      ...measure,
    })
    .refine(
      (a) => a.max >= a.min,
      "Range maximum must be at least its minimum",
    ),
  z.strictObject({ kind: z.literal("unquantified"), description: text }),
]);

const stockSchema = z.discriminatedUnion("kind", [
  z.strictObject({
    kind: z.literal("unknown"),
    presence: z.enum(["observed", "unreported"]),
  }),
  z.strictObject({ kind: z.literal("amount"), amount: amountSchema }),
  z.strictObject({ kind: z.literal("enough"), confirmedFor: amountSchema }),
  z.strictObject({ kind: z.literal("assumed"), reason: text }),
  z.strictObject({ kind: z.literal("buy-full") }),
]);

const ingredientSchema = z.strictObject({
  ingredientId: id,
  name: text,
  constraints: z.array(text),
  requirements: z
    .array(z.strictObject({ recipeVersionId: id, amount: amountSchema }))
    .min(1),
  stock: stockSchema,
  purchase: z.discriminatedUnion("kind", [
    z.strictObject({ kind: z.literal("covered"), reason: text }),
    z.strictObject({
      kind: z.literal("buy"),
      target: amountSchema.refine(
        (a) =>
          a.kind === "unquantified" ||
          (a.kind === "range" ? a.max > 0 : a.value > 0),
        "Buy target must be positive",
      ),
      reason: z.enum(["need", "pack-rounding", "stock-up", "user-edit"]),
      note: text,
    }),
  ]),
});

const shoppingListSchema = z
  .strictObject({
    shoppingListId: id,
    revision: positiveInteger,
    weekId: id,
    configuration: z.strictObject({
      householdSize: positiveInteger,
      batchRecipeCount: positiveInteger,
      individualPortionsPerRecipe: positiveInteger,
    }),
    currency: z.literal("CAD"),
    constraints: z.array(text),
    recipes: z
      .array(
        z.strictObject({
          recipeVersionId: id,
          title: text,
          source: z.strictObject({
            reference: text,
            publisher: text.optional(),
            author: text.optional(),
          }),
          sourceDigest: digest,
        }),
      )
      .min(1),
    ingredients: z.array(ingredientSchema).min(1),
  })
  .superRefine((shoppingList, ctx) => {
    const recipes = new Set(shoppingList.recipes.map((r) => r.recipeVersionId));
    const ingredients = new Set(
      shoppingList.ingredients.map((i) => i.ingredientId),
    );
    if (
      recipes.size !== shoppingList.recipes.length ||
      ingredients.size !== shoppingList.ingredients.length
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Recipe and ingredient identities must be unique",
      });
    }
    for (const ingredient of shoppingList.ingredients) {
      if (
        ingredient.requirements.some((r) => !recipes.has(r.recipeVersionId))
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Requirement references an unknown recipe version",
        });
      }
    }
  });

const unsignedApprovalSchema = z.strictObject({
  schemaVersion: z.literal(1),
  kind: z.literal("approved-shopping-list"),
  approvalId: id,
  approvedAt: time,
  shoppingList: shoppingListSchema,
});
const approvalSchema = unsignedApprovalSchema.extend({ digest });

export type ApprovalInput = z.infer<typeof unsignedApprovalSchema>;
export type ApprovedShoppingList = z.infer<typeof approvalSchema>;

// Version 1 canonical JSON: recursively sorted object keys (UTF-16 code units),
// JSON.stringify scalar spelling, array order preserved, UTF-8 bytes, no newline.
// Only schema-validated JSON values reach this function.
type JsonValue = z.infer<ReturnType<typeof z.json>>;

function canonicalJson(value: JsonValue): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key]!)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function approvalDigest(input: ApprovalInput): string {
  return `sha256:${createHash("sha256")
    .update(canonicalJson(z.json().parse(input)), "utf8")
    .digest("hex")}`;
}

/** Encode an approval already granted by the authoritative workflow. Never grants permission. */
export function sealApproval(input: unknown): ApprovedShoppingList {
  const parsed = unsignedApprovalSchema.parse(z.json().parse(input));
  return { ...parsed, digest: approvalDigest(parsed) };
}

/** Validate shape and content integrity; caller still establishes provenance and currentness. */
export function parseApproval(input: unknown): ApprovedShoppingList {
  const parsed = approvalSchema.parse(z.json().parse(input));
  const { digest: actual, ...unsigned } = parsed;
  if (actual !== approvalDigest(unsigned))
    throw new Error("Approval digest mismatch");
  return parsed;
}

const approvalIdentitySchema = z.strictObject({
  approvalId: id,
  shoppingListId: id,
  revision: positiveInteger,
  digest,
});
const pinSchema = z.strictObject({
  schemaVersion: z.literal(1),
  runId: id,
  approval: approvalIdentitySchema,
  startedAt: time,
});
export type RunPin = z.infer<typeof pinSchema>;

function identity(approval: ApprovedShoppingList): RunPin["approval"] {
  return {
    approvalId: approval.approvalId,
    shoppingListId: approval.shoppingList.shoppingListId,
    revision: approval.shoppingList.revision,
    digest: approval.digest,
  };
}
function sameIdentity(a: RunPin["approval"], b: RunPin["approval"]): boolean {
  return (
    a.approvalId === b.approvalId &&
    a.shoppingListId === b.shoppingListId &&
    a.revision === b.revision &&
    a.digest === b.digest
  );
}

/** Persist the pin with the run. Resolve any convenience pointer only before calling. */
export function pinRun(
  input: unknown,
  runId: string,
  startedAt: string,
): RunPin {
  const approval = parseApproval(input);
  const pin = pinSchema.parse({
    schemaVersion: 1,
    runId,
    approval: identity(approval),
    startedAt,
  });
  if (pin.startedAt < approval.approvedAt)
    throw new Error("Run starts before approval");
  return pin;
}

/** Check against authoritative current state before effects and again on import. */
export function assertCurrentApproval(
  pinInput: unknown,
  currentInput: unknown,
): RunPin {
  const pin = pinSchema.parse(pinInput);
  const current = parseApproval(currentInput);
  if (!sameIdentity(pin.approval, identity(current)))
    throw new Error("Pinned approval is superseded or not current");
  if (pin.startedAt < current.approvedAt)
    throw new Error("Run starts before approval");
  return pin;
}

const costsSchema = z
  .strictObject({
    currency: z.literal("CAD"),
    observedAt: time.nullable(),
    itemsMinor: integer.nullable(),
    feesMinor: integer.nullable(),
    taxesMinor: integer.nullable(),
    knownTotalMinor: integer.nullable(),
    unknownCharges: z.array(z.enum(["items", "fees", "taxes"])),
    conditions: z.array(text),
  })
  .superRefine((costs, ctx) => {
    const components = {
      items: costs.itemsMinor,
      fees: costs.feesMinor,
      taxes: costs.taxesMinor,
    };
    const unknown = Object.entries(components)
      .filter(([, value]) => value === null)
      .map(([key]) => key);
    const known = Object.values(components).filter(
      (value): value is number => value !== null,
    );
    const sum = known.length === 0 ? null : known.reduce((a, b) => a + b, 0);
    if (
      costs.unknownCharges.length !== unknown.length ||
      unknown.some(
        (k) => !costs.unknownCharges.includes(k as "items" | "fees" | "taxes"),
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Unknown charges must exactly identify null components",
      });
    }
    if (
      costs.knownTotalMinor !== sum ||
      (sum !== null && !Number.isSafeInteger(sum))
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Known total must equal the safe sum of known components, or null when nothing is known",
      });
    }
    if (known.length > 0 && costs.observedAt === null) {
      ctx.addIssue({
        code: "custom",
        message: "Known costs require an observation time",
      });
    }
  });

const resultSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    kind: z.literal("shopping-result"),
    runId: id,
    approval: approvalIdentitySchema,
    finishedAt: time,
    status: z.enum([
      "ready-for-review",
      "incomplete",
      "failed",
      "interrupted",
      "superseded",
    ]),
    reason: text,
    costs: costsSchema,
    gaps: z.array(
      z.strictObject({
        ingredientId: id,
        reason: z.enum([
          "unavailable",
          "quantity-uncertain",
          "ownership-uncertain",
          "other",
        ]),
        detail: text,
      }),
    ),
    pendingReplacements: z.array(
      z.strictObject({ ingredientId: id, proposal: text, reason: text }),
    ),
  })
  .superRefine((result, ctx) => {
    if (
      result.status === "ready-for-review" &&
      (result.gaps.length || result.pendingReplacements.length)
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "Ready results cannot contain unresolved gaps or pending replacements",
      });
    }
    if (
      result.costs.observedAt !== null &&
      result.costs.observedAt > result.finishedAt
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Cost observation cannot be after result completion",
      });
    }
  });
export type ShoppingResult = z.infer<typeof resultSchema>;

/** Validate a terminal result against its original input, including historical/superseded runs. */
export function parseRunResult(
  input: unknown,
  context: { pin: unknown; approval: unknown },
): ShoppingResult {
  const approval = parseApproval(context.approval);
  const pin = assertCurrentApproval(context.pin, approval);
  const result = resultSchema.parse(input);
  if (
    result.runId !== pin.runId ||
    !sameIdentity(result.approval, pin.approval)
  ) {
    throw new Error("Result does not match pinned run/approval identity");
  }
  if (result.finishedAt < pin.startedAt)
    throw new Error("Result precedes run start");
  const ingredients = new Set(
    approval.shoppingList.ingredients.map((i) => i.ingredientId),
  );
  if (
    [...result.gaps, ...result.pendingReplacements].some(
      (g) => !ingredients.has(g.ingredientId),
    )
  ) {
    throw new Error("Result references an unknown ingredient");
  }
  return result;
}

/** Validated data only; the planner must commit with this current-state check transactionally. */
export function parseShoppingResult(
  input: unknown,
  context: { pin: unknown; currentApproval: unknown },
): ShoppingResult {
  assertCurrentApproval(context.pin, context.currentApproval);
  return parseRunResult(input, {
    pin: context.pin,
    approval: context.currentApproval,
  });
}
