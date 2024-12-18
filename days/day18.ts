type Coordinates = [number, number];

interface GridConfig {
  dim: number;
  bytesToSimulate?: number;
}

const DIRECTIONS: Coordinates[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function createGrid(dim: number): string[][] {
  return Array.from({ length: dim }, () =>
    Array.from({ length: dim }, () => ".")
  );
}

function parseInput(
  input: string,
  isExampleThreshold = 100
): { bytes: Coordinates[]; config: GridConfig } {
  const bytes = input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number)) as Coordinates[];

  const isExample = bytes.length < isExampleThreshold;
  const config: GridConfig = {
    dim: isExample ? 7 : 71,
    bytesToSimulate: isExample ? 12 : 1024,
  };

  return { bytes, config };
}

function isValidPosition(x: number, y: number, dim: number): boolean {
  return x >= 0 && x < dim && y >= 0 && y < dim;
}

function bfs(grid: string[][], start: Coordinates, end: Coordinates): number {
  const queue: Coordinates[] = [start];
  const visited = new Set<string>();
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [x, y] = queue.shift()!;
      if (x === end[0] && y === end[1]) {
        return steps;
      }

      for (const [dx, dy] of DIRECTIONS) {
        const nx = x + dx;
        const ny = y + dy;
        const key = `${nx},${ny}`;

        if (
          !isValidPosition(nx, ny, grid.length) ||
          grid[nx][ny] === "#" ||
          visited.has(key)
        ) {
          continue;
        }
        queue.push([nx, ny]);
        visited.add(key);
      }
    }
    steps++;
  }

  return -1;
}

export function partOne(input: string) {
  const { bytes, config } = parseInput(input);
  const grid = createGrid(config.dim);

  // Simulate falling bytes
  for (let i = 0; i < Math.min(config.bytesToSimulate!, bytes.length); i++) {
    const [y, x] = bytes[i];
    if (!isValidPosition(x, y, config.dim)) continue;
    grid[x][y] = "#";
  }

  return bfs(grid, [0, 0], [config.dim - 1, config.dim - 1]);
}

export function partTwo(input: string) {
  const { bytes, config } = parseInput(input);
  const grid = createGrid(config.dim);
  const target: Coordinates = [config.dim - 1, config.dim - 1];

  // Simulate bytes falling one by one
  for (const [y, x] of bytes) {
    if (!isValidPosition(x, y, config.dim)) continue;

    grid[x][y] = "#";

    if (bfs(grid, [0, 0], target) === -1) {
      return `${y},${x}`;
    }
  }

  return null;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const example = Deno.readTextFileSync(`data/examples/day18.txt`);
  assertEquals(partOne(example), 22);
});

Deno.test("Part Two", () => {
  const example = Deno.readTextFileSync(`data/examples/day18.txt`);
  assertEquals(partTwo(example), "6,1");
});
