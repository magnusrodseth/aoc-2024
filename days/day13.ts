interface ClawMachine {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: number; y: number };
}

function parseInput(input: string): ClawMachine[] {
  const machines: ClawMachine[] = [];
  const lines = input.trim().split("\n\n");

  for (const machine of lines) {
    const [buttonA, buttonB, prize] = machine.split("\n");
    const [ax, ay] = buttonA
      .match(/X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number);
    const [bx, by] = buttonB
      .match(/X\+(\d+), Y\+(\d+)/)!
      .slice(1)
      .map(Number);
    const [px, py] = prize
      .match(/X=(\d+), Y=(\d+)/)!
      .slice(1)
      .map(Number);

    machines.push({
      buttonA: { x: ax, y: ay },
      buttonB: { x: bx, y: by },
      prize: { x: px, y: py },
    });
  }
  return machines;
}

function findSolution(machine: ClawMachine): number | null {
  const { buttonA: a, buttonB: b, prize: p } = machine;

  // Calculate number of A presses needed using the formula:
  // (by * px - bx * py) / (by * ax - bx * ay)
  const numAPresses = (b.y * p.x - b.x * p.y) / (b.y * a.x - b.x * a.y);

  // Calculate number of B presses needed
  const numBPresses = (p.x - numAPresses * a.x) / b.x;

  // Check if solution is valid (positive integers)
  if (
    numAPresses >= 0 &&
    numBPresses >= 0 &&
    Math.floor(numAPresses) === numAPresses &&
    Math.floor(numBPresses) === numBPresses
  ) {
    return Math.floor(numAPresses * 3 + numBPresses);
  }

  return null;
}

function adjustPrizeCoordinates(machine: ClawMachine): ClawMachine {
  const OFFSET = 10000000000000;
  return {
    ...machine,
    prize: {
      x: machine.prize.x + OFFSET,
      y: machine.prize.y + OFFSET,
    },
  };
}

export function partOne(input: string): number {
  const machines = parseInput(input);
  return machines.reduce((total, machine) => {
    const tokens = findSolution(machine);
    return total + (tokens ?? 0);
  }, 0);
}

export function partTwo(input: string): number {
  const machines = parseInput(input);
  return machines.reduce((total, machine) => {
    const adjustedMachine = adjustPrizeCoordinates(machine);
    const tokens = findSolution(adjustedMachine);
    return total + (tokens ?? 0);
  }, 0);
}

// Tests
import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day13.txt`);
  assertEquals(partOne(result), 480);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day13.txt`);
  assertEquals(partTwo(result), 875318608908);
});
