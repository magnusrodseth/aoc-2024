type Position = { x: number; y: number };
type Direction = [number, number];
type Grid = string[][];

function parseInput(input: string) {
  const lines = input.trim().split("\n");
  const mapEndIndex = lines.findIndex((line) => line === "");
  return {
    map: lines.slice(0, mapEndIndex),
    moves: lines
      .slice(mapEndIndex + 1)
      .join("")
      .trim(),
  };
}

function findRobot(grid: Grid): Position {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "@") {
        return { x, y };
      }
    }
  }
  throw new Error("Robot not found");
}

const DIRECTIONS: Record<string, Direction> = {
  "^": [0, -1],
  v: [0, 1],
  "<": [-1, 0],
  ">": [1, 0],
};

function calculateGPS(grid: Grid, boxChar: string): number {
  let sum = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === boxChar) {
        sum += 100 * y + x;
      }
    }
  }
  return sum;
}

export function partOne(input: string) {
  const { map, moves } = parseInput(input);
  let grid = map.map((line) => line.split(""));
  let robotPos = findRobot(grid);

  for (const move of moves) {
    const [dx, dy] = DIRECTIONS[move as keyof typeof DIRECTIONS] || [0, 0];

    let newX = robotPos.x + dx;
    let newY = robotPos.y + dy;

    // First check if we hit a wall immediately
    if (
      newY < 0 ||
      newY >= grid.length ||
      newX < 0 ||
      newX >= grid[0].length ||
      grid[newY][newX] === "#"
    ) {
      continue;
    }

    // Find the end of the chain of boxes
    let canMove = true;
    let boxChainEnd = { x: newX, y: newY };

    while (grid[boxChainEnd.y][boxChainEnd.x] === "O") {
      const nextX = boxChainEnd.x + dx;
      const nextY = boxChainEnd.y + dy;

      if (
        nextY < 0 ||
        nextY >= grid.length ||
        nextX < 0 ||
        nextX >= grid[0].length ||
        grid[nextY][nextX] === "#"
      ) {
        canMove = false;
        break;
      }

      boxChainEnd = { x: nextX, y: nextY };
    }

    if (!canMove || grid[boxChainEnd.y][boxChainEnd.x] !== ".") {
      continue;
    }

    // Move all boxes one step
    let currentX = boxChainEnd.x;
    let currentY = boxChainEnd.y;
    while (currentX !== robotPos.x || currentY !== robotPos.y) {
      const prevX = currentX - dx;
      const prevY = currentY - dy;
      grid[currentY][currentX] = grid[prevY][prevX];
      currentX = prevX;
      currentY = prevY;
    }

    grid[newY][newX] = "@";
    grid[robotPos.y][robotPos.x] = ".";
    robotPos = { x: newX, y: newY };
  }

  return calculateGPS(grid, "O");
}

function createDoubleWidthGrid(map: string[]): Grid {
  return map.map((line) =>
    line.split("").flatMap((c) => {
      switch (c) {
        case "#":
          return ["#", "#"];
        case "@":
          return ["@", "."];
        case "O":
          return ["[", "]"];
        default:
          return [".", "."];
      }
    })
  );
}

export function partTwo(input: string) {
  const { map, moves } = parseInput(input);
  let grid = createDoubleWidthGrid(map);
  let robotPos = findRobot(grid);

  for (const move of moves) {
    const [dx, dy] = DIRECTIONS[move as keyof typeof DIRECTIONS] || [0, 0];

    let toMove: Array<[string, Position]> = [["@", robotPos]];
    let border = [robotPos];

    while (border.length > 0) {
      const nextBorder: Position[] = [];

      for (const pos of border) {
        const newX = pos.x + dx;
        const newY = pos.y + dy;

        if (
          newY < 0 ||
          newY >= grid.length ||
          newX < 0 ||
          newX >= grid[0].length
        )
          continue;

        const nextChar = grid[newY][newX];
        if (nextChar === "#") {
          toMove = [];
          break;
        }

        if ((nextChar === "[" || nextChar === "]") && dy === 0) {
          nextBorder.push({ x: newX, y: newY });
        } else if (nextChar === "[") {
          nextBorder.push({ x: newX, y: newY });
          nextBorder.push({ x: newX + 1, y: newY });
        } else if (nextChar === "]") {
          nextBorder.push({ x: newX, y: newY });
          nextBorder.push({ x: newX - 1, y: newY });
        }
      }

      if (toMove.length === 0) break;

      toMove.push(
        ...nextBorder.map(
          (pos) => [grid[pos.y][pos.x], pos] as [string, Position]
        )
      );
      border = nextBorder;
    }

    if (toMove.length === 0) continue;

    toMove.sort((a, b) => {
      if (dy !== 0) return dy * (b[1].y - a[1].y);
      return dx * (b[1].x - a[1].x);
    });

    for (const [char, pos] of toMove) {
      if (char === "@") {
        robotPos = { x: pos.x + dx, y: pos.y + dy };
      }
      grid[pos.y][pos.x] = ".";
      grid[pos.y + dy][pos.x + dx] = char;
    }
  }

  return calculateGPS(grid, "[");
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day15.txt`);
  assertEquals(partOne(result), 10092);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day15.txt`);
  assertEquals(partTwo(result), 9021);
});
