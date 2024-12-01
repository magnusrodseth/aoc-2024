function parseInput(input: string) {
  return input.split("\n").map((line) => {
    const [first, second] = line.trim().split(/\s+/).map(Number);
    return { first: first || 0, second: second || 0 };
  });
}

function calculateTotalDistance(left: number[], right: number[]): number {
  return left.reduce(
    (total, leftNum, i) => total + Math.abs(leftNum - right[i]),
    0
  );
}

function calculateSimilarityScore(left: number[], right: number[]): number {
  return left.reduce((score, leftNum) => {
    const occurrences = right.filter((num) => num === leftNum).length;
    return score + leftNum * occurrences;
  }, 0);
}

export function partOne(input: string) {
  const lines = parseInput(input);
  const left = lines.map((it) => it.first).sort((a, b) => a - b);
  const right = lines.map((it) => it.second).sort((a, b) => a - b);
  return calculateTotalDistance(left, right);
}

export function partTwo(input: string) {
  const lines = parseInput(input);
  const left = lines.map((it) => it.first);
  const right = lines.map((it) => it.second);
  return calculateSimilarityScore(left, right);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const example = Deno.readTextFileSync(`data/examples/day01.txt`);
  assertEquals(partOne(example), 11);
});

Deno.test("Part Two", () => {
  const example = Deno.readTextFileSync(`data/examples/day01.txt`);
  assertEquals(partTwo(example), 31); // Replace null with expected result for Part Two
});
