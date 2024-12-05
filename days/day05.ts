type Rules = Map<number, Set<number>>;

function parseRules(rulesSection: string): Rules {
  const rules = new Map<number, Set<number>>();
  rulesSection.split("\n").forEach((rule) => {
    const [before, after] = rule.split("|").map(Number);
    if (!rules.has(before)) rules.set(before, new Set());
    rules.get(before)!.add(after);
  });
  return rules;
}

function parseUpdates(updatesSection: string): number[][] {
  return updatesSection.split("\n").map((line) => line.split(",").map(Number));
}

function isValidUpdate(update: number[], rules: Rules): boolean {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const first = update[i];
      const second = update[j];
      if (rules.has(second) && rules.get(second)!.has(first)) {
        return false;
      }
    }
  }
  return true;
}

function sortUpdate(update: number[], rules: Rules): number[] {
  return [...update].sort((a, b) => {
    if (rules.has(b) && rules.get(b)!.has(a)) return 1;
    if (rules.has(a) && rules.get(a)!.has(b)) return -1;
    return 0;
  });
}

function sumMiddleNumbers(updates: number[][]): number {
  return updates.reduce((sum, update) => {
    const middleIndex = Math.floor(update.length / 2);
    return sum + update[middleIndex];
  }, 0);
}

export function partOne(input: string): number {
  const [rulesSection, updatesSection] = input.trim().split("\n\n");
  const rules = parseRules(rulesSection);
  const updates = parseUpdates(updatesSection);

  const validUpdates = updates.filter((update) => isValidUpdate(update, rules));
  return sumMiddleNumbers(validUpdates);
}

export function partTwo(input: string): number {
  const [rulesSection, updatesSection] = input.trim().split("\n\n");
  const rules = parseRules(rulesSection);
  const updates = parseUpdates(updatesSection);

  const invalidUpdates = updates.filter(
    (update) => !isValidUpdate(update, rules)
  );
  const sortedUpdates = invalidUpdates.map((update) =>
    sortUpdate(update, rules)
  );
  return sumMiddleNumbers(sortedUpdates);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day05.txt`);
  assertEquals(partOne(result), 143); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day05.txt`);
  assertEquals(partTwo(result), 123); // Replace null with expected result for Part Two
});
