export function partOne(input: string) {
  return calculateTotalStones(input, 25);
}

export function partTwo(input: string) {
  return calculateTotalStones(input, 75);
}

function calculateTotalStones(input: string, blinks: number): number {
  const stones = parseInput(input);
  const memo: Map<string, number> = new Map();

  return stones.reduce(
    (sum, stone) => sum + countPossibleStones(stone, blinks, memo),
    0
  );
}

function countPossibleStones(
  num: number,
  steps: number,
  memo: Map<string, number>
): number {
  if (steps === 0) {
    return 1;
  }

  const key = `${num},${steps}`;
  if (memo.has(key)) {
    return memo.get(key)!;
  }

  const newStones = transformStone(num);
  const result = newStones.reduce(
    (sum, stone) => sum + countPossibleStones(stone, steps - 1, memo),
    0
  );
  memo.set(key, result);
  return result;
}

function parseInput(input: string): number[] {
  return input.trim().split(/\s+/).map(Number);
}

function transformStone(num: number): number[] {
  const digits = num.toString().length;

  if (num === 0) {
    return [1];
  } else if (digits % 2 === 0) {
    const raise = Math.pow(10, digits / 2);
    const a = Math.floor(num / raise);
    const b = num - a * raise;
    return [a, b];
  } else {
    return [num * 2024];
  }
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day11.txt`);
  assertEquals(partOne(result), 55312);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day11.txt`);
  assertEquals(partTwo(result), 65601038650482);
});
