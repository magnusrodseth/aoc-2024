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

// Example Input and Tests
if (import.meta.main) {
  const example = Deno.readTextFileSync(`data/examples/01.txt`);
  console.log("Example Result Part One:\n", partOne(example));
  console.log("Example Result Part Two:\n", partTwo(example));
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const example = Deno.readTextFileSync(`data/inputs/day01.txt`);
  assertEquals(partOne(example), null); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const example = Deno.readTextFileSync(`data/inputs/day01.txt`);
  assertEquals(partTwo(example), null); // Replace null with expected result for Part Two
});
