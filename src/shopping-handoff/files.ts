import { createHash, randomUUID } from "node:crypto";
import { link, mkdir, open, readFile, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import {
  parseApproval,
  parseRunResult,
  parseShoppingResult,
  type ApprovedShoppingList,
  type ShoppingResult,
} from "./contract.js";

// Private caller-owned directory on one local filesystem. A hard link publishes a
// fully written file without overwriting any prior export, even across processes.
async function publishImmutableJson(
  directory: string,
  name: string,
  data: ApprovedShoppingList | ShoppingResult,
): Promise<string> {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const target = resolve(directory, name);
  const temporary = resolve(directory, `.handoff.${randomUUID()}.tmp`);
  const bytes = `${JSON.stringify(data, null, 2)}\n`;
  const file = await open(temporary, "wx", 0o600);
  try {
    try {
      await file.writeFile(bytes, "utf8");
      await file.sync();
    } finally {
      await file.close();
    }
    try {
      await link(temporary, target);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if ((await readFile(target, "utf8")) !== bytes)
        throw new Error("Immutable export conflict", { cause: error });
    }
    return target;
  } finally {
    await unlink(temporary);
  }
}

// Identity-only key: conflicting content still maps to the same immutable file.
// Fixed-length lowercase hex avoids Windows case/device-name/length collisions.
function fileKey(identity: (string | number)[]): string {
  return createHash("sha256")
    .update(JSON.stringify(identity), "utf8")
    .digest("hex");
}

/** Planner: export an approved revision for a separately launched shopping skill. */
export async function exportApproval(
  directory: string,
  input: unknown,
): Promise<string> {
  const approval = parseApproval(input);
  const key = fileKey([
    approval.shoppingList.shoppingListId,
    approval.shoppingList.revision,
    approval.approvalId,
  ]);
  return publishImmutableJson(
    directory,
    `approval.r${approval.shoppingList.revision}.${key}.json`,
    approval,
  );
}

/** Shopping skill: publish one terminal result file for the planner to import later. */
export async function exportRunResult(
  directory: string,
  input: unknown,
  context: Parameters<typeof parseRunResult>[1],
): Promise<string> {
  const result = parseRunResult(input, context);
  return publishImmutableJson(
    directory,
    `result.${fileKey([result.runId])}.json`,
    result,
  );
}

/** Planner: read and validate the skill's result file without changing saved state. */
export async function readShoppingResult(
  path: string,
  context: Parameters<typeof parseShoppingResult>[1],
): Promise<ReturnType<typeof parseShoppingResult>> {
  return parseShoppingResult(
    JSON.parse(await readFile(path, "utf8")) as unknown,
    context,
  );
}
