type Point = [number, number];
type Grid = number[][];

function findTrailheads(grid: Grid): Point[] {
  const trailheads: Point[] = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === 0) {
        trailheads.push([y, x]);
      }
    }
  }
  return trailheads;
}

function parseGrid(input: string): Grid {
  return input.split("\n").map((line) => line.split("").map(Number));
}

function isValidPosition(y: number, x: number, grid: Grid): boolean {
  return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}

const DIRECTIONS: Point[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

export function partOne(input: string) {
  const grid = parseGrid(input);
  const trailheads = findTrailheads(grid);

  return trailheads
    .map(([startY, startX]) => {
      const reachable9s = new Set<string>();

      function dfs(
        y: number,
        x: number,
        expectedHeight: number,
        visited: Set<string>
      ) {
        const key = `${y},${x}`;
        if (
          !isValidPosition(y, x, grid) ||
          visited.has(key) ||
          grid[y][x] !== expectedHeight
        ) {
          return;
        }

        visited.add(key);
        if (expectedHeight === 9) {
          reachable9s.add(key);
          return;
        }

        for (const [dy, dx] of DIRECTIONS) {
          const newVisited = new Set(visited);
          dfs(y + dy, x + dx, expectedHeight + 1, newVisited);
        }
      }

      dfs(startY, startX, 0, new Set());
      return reachable9s.size;
    })
    .reduce((a, b) => a + b, 0);
}

export function partTwo(input: string) {
  const grid = parseGrid(input);
  const trailheads = findTrailheads(grid);

  return trailheads
    .map(([startY, startX]) => {
      const memo = new Map<string, number>();

      function countTrails(
        y: number,
        x: number,
        expectedHeight: number
      ): number {
        const key = `${y},${x},${expectedHeight}`;
        if (memo.has(key)) return memo.get(key)!;

        if (!isValidPosition(y, x, grid) || grid[y][x] !== expectedHeight) {
          return 0;
        }

        if (expectedHeight === 9) return 1;

        const totalTrails = DIRECTIONS.reduce(
          (sum, [dy, dx]) =>
            sum + countTrails(y + dy, x + dx, expectedHeight + 1),
          0
        );

        memo.set(key, totalTrails);
        return totalTrails;
      }

      return countTrails(startY, startX, 0);
    })
    .reduce((a, b) => a + b, 0);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day10.txt`);
  assertEquals(partOne(result), 36); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day10.txt`);
  assertEquals(partTwo(result), 81); // Using the example result from the problem
});
