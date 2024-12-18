type Direction = "N" | "E" | "S" | "W";

interface Position {
  x: number;
  y: number;
  direction: Direction;
}

interface GridInfo {
  grid: string[][];
  width: number;
  height: number;
  start: Position;
}

interface SearchState {
  position: Position;
  score: number;
  trail?: Position[];
}

// Shared constants
const DIRECTIONS: Record<Direction, [number, number]> = {
  N: [0, -1],
  E: [1, 0],
  S: [0, 1],
  W: [-1, 0],
};

const TURNS: Record<Direction, Direction[]> = {
  N: ["E", "W"],
  E: ["N", "S"],
  S: ["E", "W"],
  W: ["N", "S"],
};

function parseGrid(input: string): GridInfo {
  const grid = input.split("\n").map((line) => line.split(""));
  const height = grid.length;
  const width = grid[0].length;

  // Find start position
  let start: Position | null = null;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x] === "S") {
        start = { x, y, direction: "E" };
      }
    }
  }

  if (!start) throw new Error("No start position found");

  return { grid, width, height, start };
}

function isValidMove(x: number, y: number, gridInfo: GridInfo): boolean {
  const { width, height, grid } = gridInfo;
  return x >= 0 && x < width && y >= 0 && y < height && grid[y][x] !== "#";
}

function getStateKey(position: Position): string {
  return `${position.x},${position.y},${position.direction}`;
}

export function partOne(input: string): number {
  const gridInfo = parseGrid(input);
  const { grid, start } = gridInfo;

  const visited = new Set<string>();
  const queue: SearchState[] = [{ position: start, score: 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.score - b.score);
    const current = queue.shift()!;
    const { position, score } = current;

    const key = getStateKey(position);
    if (visited.has(key)) continue;
    visited.add(key);

    if (grid[position.y][position.x] === "E") {
      return score;
    }

    // Try moving forward
    const [dx, dy] = DIRECTIONS[position.direction];
    const newX = position.x + dx;
    const newY = position.y + dy;

    if (isValidMove(newX, newY, gridInfo)) {
      queue.push({
        position: { x: newX, y: newY, direction: position.direction },
        score: score + 1,
      });
    }

    // Try turning
    for (const newDirection of TURNS[position.direction]) {
      queue.push({
        position: { x: position.x, y: position.y, direction: newDirection },
        score: score + 1000,
      });
    }
  }

  return 0;
}

export function partTwo(input: string): number {
  const gridInfo = parseGrid(input);
  const { grid, start } = gridInfo;

  const visited = new Map<string, number>();
  const toCheck: SearchState[] = [
    {
      position: start,
      score: 0,
      trail: [start],
    },
  ];

  let bestScore = Infinity;
  const optimalTiles = new Set<string>();

  while (toCheck.length > 0) {
    toCheck.sort((a, b) => b.score - a.score);
    const current = toCheck.pop()!;

    if (current.score > bestScore) continue;

    const stateKey = getStateKey(current.position);
    if (visited.has(stateKey) && visited.get(stateKey)! < current.score) {
      continue;
    }
    visited.set(stateKey, current.score);

    if (grid[current.position.y][current.position.x] === "E") {
      if (current.score <= bestScore) {
        bestScore = current.score;
        current.trail?.forEach((pos) => {
          optimalTiles.add(`${pos.x},${pos.y}`);
        });
      }
      continue;
    }

    // Try moving forward
    const [dx, dy] = DIRECTIONS[current.position.direction];
    const newX = current.position.x + dx;
    const newY = current.position.y + dy;

    if (isValidMove(newX, newY, gridInfo)) {
      const newPos = {
        x: newX,
        y: newY,
        direction: current.position.direction,
      };
      toCheck.push({
        position: newPos,
        score: current.score + 1,
        trail: [...(current.trail || []), newPos],
      });
    }

    // Try turning
    for (const newDirection of TURNS[current.position.direction]) {
      const newPos = {
        x: current.position.x,
        y: current.position.y,
        direction: newDirection,
      };
      toCheck.push({
        position: newPos,
        score: current.score + 1000,
        trail: [...(current.trail || []), newPos],
      });
    }
  }

  return optimalTiles.size;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day16.txt`);
  assertEquals(partOne(result), 7036);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day16.txt`);
  assertEquals(partTwo(result), 45); // First example has 45 tiles in optimal paths
});
