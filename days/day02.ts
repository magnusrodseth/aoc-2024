type Level = number[];

const parseInput = (input: string): Level[] =>
  input.split("\n").map((line) => line.trim().split(/\s+/).map(Number));

const hasValidDifferences = (level: Level): boolean => {
  for (let i = 0; i < level.length - 1; i++) {
    const diff = Math.abs(level[i] - level[i + 1]);
    if (diff < 1 || diff > 3) return false;
  }
  return true;
};

const isMonotonic = (level: Level): boolean => {
  // Check if strictly increasing
  const isIncreasing = level.every(
    (num, i, arr) => i === arr.length - 1 || num < arr[i + 1]
  );
  // Check if strictly decreasing
  const isDecreasing = level.every(
    (num, i, arr) => i === arr.length - 1 || num > arr[i + 1]
  );

  return isIncreasing || isDecreasing;
};

const isLevelSafe = (level: Level): boolean =>
  hasValidDifferences(level) && isMonotonic(level);

const isLevelSafeWithDampener = (level: Level): boolean => {
  if (isLevelSafe(level)) return true;

  // Try removing each number one at a time
  return level.some((_, i) => {
    const modifiedLevel = [...level.slice(0, i), ...level.slice(i + 1)];
    return isLevelSafe(modifiedLevel);
  });
};

export function partOne(input: string): number {
  const levels = parseInput(input);
  return levels.filter(isLevelSafe).length;
}

export function partTwo(input: string): number {
  const levels = parseInput(input);
  return levels.filter(isLevelSafeWithDampener).length;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day02.txt`);
  assertEquals(partOne(result), 2); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day02.txt`);
  assertEquals(partTwo(result), 4); // Replace null with expected result for Part Two
});
