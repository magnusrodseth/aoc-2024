interface Position {
  x: number;
  y: number;
  dir: string;
}

interface Direction {
  dx: number;
  dy: number;
}

// Common constants and utility functions
const DIRECTIONS: Record<string, Direction> = {
  "^": { dx: 0, dy: -1 },
  ">": { dx: 1, dy: 0 },
  v: { dx: 0, dy: 1 },
  "<": { dx: -1, dy: 0 },
};

const TURN_RIGHT: Record<string, string> = {
  "^": ">",
  ">": "v",
  v: "<",
  "<": "^",
};

function parseGrid(input: string) {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function findStartPosition(grid: string[][]): Position {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "^") {
        grid[y][x] = "."; // Clear the starting position
        return { x, y, dir: "^" };
      }
    }
  }
  throw new Error("No starting position found");
}

function isOutOfBounds(pos: { x: number; y: number }, grid: string[][]) {
  return (
    pos.y < 0 || pos.y >= grid.length || pos.x < 0 || pos.x >= grid[0].length
  );
}

export function partOne(input: string) {
  const grid = parseGrid(input);
  const visited = new Set<string>();
  const pos = findStartPosition(grid);
  visited.add(`${pos.x},${pos.y}`);

  while (true) {
    const dir = DIRECTIONS[pos.dir];
    const nextPos = { x: pos.x + dir.dx, y: pos.y + dir.dy };

    if (isOutOfBounds(nextPos, grid)) {
      break;
    }

    if (grid[nextPos.y][nextPos.x] === "#") {
      pos.dir = TURN_RIGHT[pos.dir];
    } else {
      pos.x = nextPos.x;
      pos.y = nextPos.y;
      visited.add(`${pos.x},${pos.y}`);
    }
  }

  return visited.size;
}

export function partTwo(input: string) {
  const grid = parseGrid(input);
  const startPos = findStartPosition(grid);

  function simulateMovement(testGrid: string[][], pos: Position): boolean {
    const visited = new Set<string>();

    while (true) {
      const state = `${pos.x},${pos.y},${pos.dir}`;
      if (visited.has(state)) {
        return true; // Found a loop
      }
      visited.add(state);

      const dir = DIRECTIONS[pos.dir];
      const nextPos = { x: pos.x + dir.dx, y: pos.y + dir.dy };

      if (isOutOfBounds(nextPos, testGrid)) {
        return false;
      }

      if (testGrid[nextPos.y][nextPos.x] === "#") {
        pos.dir = TURN_RIGHT[pos.dir];
      } else {
        pos.x = nextPos.x;
        pos.y = nextPos.y;
      }
    }
  }

  function createsLoop(obstacleX: number, obstacleY: number): boolean {
    const testGrid = grid.map((row) => [...row]);
    testGrid[obstacleY][obstacleX] = "#";
    return simulateMovement(testGrid, { ...startPos });
  }

  let loopCount = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== "." || (x === startPos.x && y === startPos.y)) {
        continue;
      }
      if (createsLoop(x, y)) {
        loopCount++;
      }
    }
  }

  return loopCount;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day06.txt`);
  assertEquals(partOne(result), 41); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day06.txt`);
  assertEquals(partTwo(result), 6); // Replace null with expected result for Part Two
});
