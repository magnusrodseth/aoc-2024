interface Robot {
  px: number;
  py: number;
  vx: number;
  vy: number;
}

interface Position {
  x: number;
  y: number;
}

function parseRobots(input: string): Robot[] {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [pos, vel] = line.split(" ");
      const [px, py] = pos.slice(2).split(",").map(Number);
      const [vx, vy] = vel.slice(2).split(",").map(Number);
      return { px, py, vx, vy };
    });
}

function calculatePosition(
  robot: Robot,
  seconds: number,
  width: number,
  height: number
): Position {
  const x = (((robot.px + robot.vx * seconds) % width) + width) % width;
  const y = (((robot.py + robot.vy * seconds) % height) + height) % height;
  return { x, y };
}

function getDimensions(isExample: boolean) {
  return {
    width: isExample ? 11 : 101,
    height: isExample ? 7 : 103,
  };
}

export function partOne(input: string) {
  const robots = parseRobots(input);
  const { width, height } = getDimensions(robots.length <= 12);
  const SECONDS = 100;

  const finalPositions = robots.map((robot) =>
    calculatePosition(robot, SECONDS, width, height)
  );

  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);

  const quadrants = [
    (p: Position) => p.x < midX && p.y < midY,
    (p: Position) => p.x > midX && p.y < midY,
    (p: Position) => p.x < midX && p.y > midY,
    (p: Position) => p.x > midX && p.y > midY,
  ];

  return quadrants
    .map((check) => finalPositions.filter(check).length)
    .reduce((a, b) => a * b);
}

export async function partTwo(input: string) {
  const { width, height } = getDimensions(false);
  const robots = parseRobots(input);
  let output = "";

  for (let seconds = 1; seconds <= 10_000; seconds++) {
    // Initialize empty picture
    const picture = Array(height)
      .fill(null)
      .map(() => Array(width).fill("."));

    // Mark robot positions
    robots
      .map((robot) => calculatePosition(robot, seconds, width, height))
      .forEach((pos) => {
        picture[pos.y][pos.x] = "X";
      });

    // Build frame output
    output += `After seconds: ${seconds}\n`;
    output += picture.map((row) => row.join("")).join("\n");
    output += "\n\n";
  }

  // Write output and provide instructions
  await Deno.writeTextFile("days/day14-christmas-tree.txt", output);
  console.log(
    "\nFile generated! Now run this command to find the Christmas tree:"
  );
  console.log("grep -B 50 XXXXXXX days/day14-christmas-tree.txt");

  return null;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day14.txt`);
  assertEquals(partOne(result), 12); // Using the example result from the problem
});

Deno.test("Part Two", async () => {
  const result = Deno.readTextFileSync(`data/examples/day14.txt`);
  assertEquals(await partTwo(result), null);
});
