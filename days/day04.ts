type Grid = string[][];
type Direction = [number, number];
type Pattern = string[];

function createGrid(input: string): Grid {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function isInBounds(row: number, col: number, grid: Grid): boolean {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

function checkPattern(
  startRow: number,
  startCol: number,
  direction: Direction,
  pattern: Pattern,
  grid: Grid
): boolean {
  for (let i = 0; i < pattern.length; i++) {
    const newRow = startRow + direction[0] * i;
    const newCol = startCol + direction[1] * i;

    if (
      !isInBounds(newRow, newCol, grid) ||
      grid[newRow][newCol] !== pattern[i]
    ) {
      return false;
    }
  }
  return true;
}

export function partOne(input: string) {
  const grid = createGrid(input);
  let count = 0;
  const word = "XMAS";

  // All possible directions: right, down-right, down, down-left, left, up-left, up, up-right
  const directions: Direction[] = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
  ];

  // Check each starting position
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      // Try each direction from this position
      for (const direction of directions) {
        if (checkPattern(row, col, direction, word.split(""), grid)) {
          count++;
        }
      }
    }
  }

  return count;
}

export function partTwo(input: string) {
  const grid = createGrid(input);
  let count = 0;

  // All possible X patterns [diagonal1, diagonal2]
  const xPatterns: [Pattern, Pattern][] = [
    [
      ["M", "A", "S"],
      ["M", "A", "S"],
    ],
    [
      ["M", "A", "S"],
      ["S", "A", "M"],
    ],
    [
      ["S", "A", "M"],
      ["M", "A", "S"],
    ],
    [
      ["S", "A", "M"],
      ["S", "A", "M"],
    ],
  ];

  // Check each center position for X pattern
  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[0].length - 1; col++) {
      for (const [pattern1, pattern2] of xPatterns) {
        const isValid =
          checkPattern(row - 1, col - 1, [1, 1], pattern1, grid) && // top-left to bottom-right
          checkPattern(row - 1, col + 1, [1, -1], pattern2, grid); // top-right to bottom-left

        if (isValid) count++;
      }
    }
  }

  return count;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day04.txt`);
  assertEquals(partOne(result), 18); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day04.txt`);
  assertEquals(partTwo(result), 9); // Replace null with expected result for Part Two
});
