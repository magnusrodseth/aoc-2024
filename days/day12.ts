type Grid = string[][];
type Point = [number, number];
type RegionInfo = { area: number; perimeter: number };
type RegionInfoWithSides = { area: number; sides: number };

// Shared utilities
function parseInput(input: string): Grid {
  return input
    .trim()
    .split("\n")
    .map((line) => line.split(""));
}

function isValid(r: number, c: number, rows: number, cols: number): boolean {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

const DIRECTIONS: Point[] = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
];

// Part One
export function partOne(input: string) {
  const grid = parseInput(input);
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();

  function getRegionInfo(r: number, c: number, letter: string): RegionInfo {
    const queue: Point[] = [[r, c]];
    const region = new Set<string>();
    let perimeter = 0;

    while (queue.length > 0) {
      const [currentR, currentC] = queue.shift()!;
      const key = `${currentR},${currentC}`;

      if (region.has(key)) continue;

      region.add(key);
      visited.add(key);

      for (const [dr, dc] of DIRECTIONS) {
        const newR = currentR + dr;
        const newC = currentC + dc;

        if (!isValid(newR, newC, rows, cols) || grid[newR][newC] !== letter) {
          perimeter++;
        } else if (!region.has(`${newR},${newC}`)) {
          queue.push([newR, newC]);
        }
      }
    }

    return { area: region.size, perimeter };
  }

  return calculateTotalPrice(grid, visited, getRegionInfo);
}

// Part Two
export function partTwo(input: string) {
  const grid = parseInput(input);
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();

  function getRegionInfo(
    r: number,
    c: number,
    letter: string
  ): RegionInfoWithSides {
    const queue: Point[] = [[r, c]];
    const region = new Set<string>();
    const shape = new Set<string>();

    // Build region and shape
    while (queue.length > 0) {
      const [currentR, currentC] = queue.shift()!;
      const key = `${currentR},${currentC}`;

      if (region.has(key)) continue;

      region.add(key);
      visited.add(key);
      shape.add(`${currentR},${currentC}`);

      for (const [dr, dc] of DIRECTIONS) {
        const newR = currentR + dr;
        const newC = currentC + dc;
        if (
          isValid(newR, newC, rows, cols) &&
          grid[newR][newC] === letter &&
          !region.has(`${newR},${newC}`)
        ) {
          queue.push([newR, newC]);
        }
      }
    }

    const sides = countShapeSides(shape, rows, cols);
    return { area: shape.size, sides };
  }

  return calculateTotalPrice(grid, visited, getRegionInfo);
}

// Shared helper functions
function calculateTotalPrice<T extends { area: number }>(
  grid: Grid,
  visited: Set<string>,
  getRegionInfo: (
    r: number,
    c: number,
    letter: string
  ) => T & { [key: string]: number }
): number {
  let totalPrice = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (!visited.has(key)) {
        const info = getRegionInfo(r, c, grid[r][c]);
        // Multiply area by either perimeter (part 1) or sides (part 2)
        totalPrice += info.area * (info.perimeter ?? info.sides);
      }
    }
  }

  return totalPrice;
}

function countShapeSides(
  shape: Set<string>,
  rows: number,
  cols: number
): number {
  const coords = Array.from(shape).map((s) => s.split(",").map(Number));
  const minY = Math.min(...coords.map(([y]) => y));
  const maxY = Math.max(...coords.map(([y]) => y));
  const minX = Math.min(...coords.map(([_, x]) => x));
  const maxX = Math.max(...coords.map(([_, x]) => x));

  let sides = 0;

  // Count horizontal sides
  sides += countDirectionalSides(shape, minY, maxY, minX, maxX, rows, true);
  // Count vertical sides
  sides += countDirectionalSides(shape, minX, maxX, minY, maxY, cols, false);

  return sides;
}

function countDirectionalSides(
  shape: Set<string>,
  outerMin: number,
  outerMax: number,
  innerMin: number,
  innerMax: number,
  limit: number,
  isHorizontal: boolean
): number {
  let sides = 0;

  for (let outer = outerMin; outer <= outerMax; outer++) {
    let inRegion = false;
    let prevInRegion = false;

    for (let inner = innerMin; inner <= innerMax; inner++) {
      const point = isHorizontal ? `${outer},${inner}` : `${inner},${outer}`;
      const isInShape = shape.has(point);

      if (isInShape) {
        // Check first edge
        const firstNeighbor = isHorizontal
          ? `${outer - 1},${inner}`
          : `${inner},${outer - 1}`;
        if (outer === 0 || !shape.has(firstNeighbor)) {
          inRegion = true;
        } else if (inRegion) {
          sides++;
          inRegion = false;
        }

        // Check second edge
        const secondNeighbor = isHorizontal
          ? `${outer + 1},${inner}`
          : `${inner},${outer + 1}`;
        if (outer === limit - 1 || !shape.has(secondNeighbor)) {
          prevInRegion = true;
        } else if (prevInRegion) {
          sides++;
          prevInRegion = false;
        }
      } else {
        if (inRegion) {
          sides++;
          inRegion = false;
        }
        if (prevInRegion) {
          sides++;
          prevInRegion = false;
        }
      }
    }
    if (inRegion) sides++;
    if (prevInRegion) sides++;
  }

  return sides;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day12.txt`);
  assertEquals(partOne(result), 1930); // Using the larger example's result
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day12.txt`);
  assertEquals(partTwo(result), 1206);
});
