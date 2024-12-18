function createGrid(dim: number): string[][] {
  return Array.from({ length: dim }, () =>
    Array.from({ length: dim }, () => ".")
  );
}

function bfs(
  grid: string[][],
  start: [number, number],
  end: [number, number]
): number {
  const queue: [number, number][] = [start];
  const visited = new Set<string>();
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [x, y] = queue.shift()!;
      if (x === end[0] && y === end[1]) {
        return steps;
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx < 0 ||
          nx >= grid.length ||
          ny < 0 ||
          ny >= grid[0].length ||
          grid[nx][ny] === "#" ||
          visited.has(`${nx},${ny}`)
        ) {
          continue;
        }
        queue.push([nx, ny]);
        visited.add(`${nx},${ny}`);
      }
    }
    steps++;
  }

  return -1;
}

export function partOne(input: string) {
  const bytes = input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number));

  // For the real input
  const DIM = 71;
  const BYTES_TO_SIMULATE = 1024;

  // Special case for the example input (7x7 grid, 12 bytes)
  const isExample = bytes.length < 100; // Arbitrary threshold to detect example
  const dim = isExample ? 7 : DIM;
  const bytesToSimulate = isExample ? 12 : BYTES_TO_SIMULATE;

  const grid = createGrid(dim);

  // Simulate falling bytes
  for (let i = 0; i < Math.min(bytesToSimulate, bytes.length); i++) {
    const [y, x] = bytes[i];
    if (x < 0 || x >= dim || y < 0 || y >= dim) continue;
    grid[x][y] = "#";
  }

  return bfs(grid, [0, 0], [dim - 1, dim - 1]);
}

export function partTwo(input: string) {
  const bytes = input
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number));

  // Special case for the example input
  const isExample = bytes.length < 100;
  const dim = isExample ? 7 : 71;

  const grid = createGrid(dim);

  // Simulate bytes falling one by one
  for (let i = 0; i < bytes.length; i++) {
    const [y, x] = bytes[i];
    if (x < 0 || x >= dim || y < 0 || y >= dim) continue;

    grid[x][y] = "#";

    // Check if path is still possible
    const shortestPath = bfs(grid, [0, 0], [dim - 1, dim - 1]);
    if (shortestPath === -1) {
      return `${y},${x}`; // Return coordinates that block the path
    }
  }

  return null; // If no blocking byte is found
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
