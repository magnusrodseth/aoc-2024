type Point = { x: number; y: number };
type Antenna = Point & { freq: string };

function findAntennas(input: string): Antenna[] {
  const lines = input.trim().split("\n");
  const antennas: Antenna[] = [];

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];
      if (char !== ".") {
        antennas.push({ x, y, freq: char });
      }
    }
  }
  return antennas;
}

function groupAntennasByFrequency(antennas: Antenna[]): Map<string, Antenna[]> {
  const freqGroups = new Map<string, Antenna[]>();
  for (const antenna of antennas) {
    if (!freqGroups.has(antenna.freq)) {
      freqGroups.set(antenna.freq, []);
    }
    freqGroups.get(antenna.freq)!.push(antenna);
  }
  return freqGroups;
}

function isInBounds(point: Point, width: number, height: number): boolean {
  return point.x >= 0 && point.x < width && point.y >= 0 && point.y < height;
}

function processAntennaGroups(
  freqGroups: Map<string, Antenna[]>,
  width: number,
  height: number,
  processGroup: (group: Antenna[]) => Point[]
): number {
  const antinodes = new Set<string>();

  for (const [_, group] of freqGroups) {
    // Skip frequencies with only one antenna
    if (group.length < 2) continue;

    const points = processGroup(group);
    for (const point of points) {
      if (isInBounds(point, width, height)) {
        antinodes.add(`${point.x},${point.y}`);
      }
    }
  }

  return antinodes.size;
}

// Part One specific functions
function calculateAntinodes(a1: Antenna, a2: Antenna): Point[] {
  const dx = a2.x - a1.x;
  const dy = a2.y - a1.y;
  return [
    { x: a1.x - dx, y: a1.y - dy },
    { x: a2.x + dx, y: a2.y + dy },
  ];
}

function processGroupPartOne(group: Antenna[]): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const nodes = calculateAntinodes(group[i], group[j]);
      points.push(...nodes);
    }
  }
  return points;
}

// Part Two specific functions
function areCollinear(p1: Point, p2: Point, p3: Point): boolean {
  return (p2.y - p1.y) * (p3.x - p2.x) === (p3.y - p2.y) * (p2.x - p1.x);
}

function findCollinearPoints(
  p1: Point,
  p2: Point,
  width: number,
  height: number
): Point[] {
  const points: Point[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const point: Point = { x, y };
      if (areCollinear(p1, p2, point)) {
        points.push(point);
      }
    }
  }
  return points;
}

function processGroupPartTwo(
  group: Antenna[],
  width: number,
  height: number
): Point[] {
  const points: Point[] = [...group]; // Include antennas themselves

  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      points.push(...findCollinearPoints(group[i], group[j], width, height));
    }
  }
  return points;
}

export function partOne(input: string) {
  const lines = input.trim().split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const antennas = findAntennas(input);
  const freqGroups = groupAntennasByFrequency(antennas);

  return processAntennaGroups(freqGroups, width, height, processGroupPartOne);
}

export function partTwo(input: string) {
  const lines = input.trim().split("\n");
  const width = lines[0].length;
  const height = lines.length;
  const antennas = findAntennas(input);
  const freqGroups = groupAntennasByFrequency(antennas);

  return processAntennaGroups(freqGroups, width, height, (group) =>
    processGroupPartTwo(group, width, height)
  );
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day08.txt`);
  assertEquals(partOne(result), 14);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day08.txt`);
  assertEquals(partTwo(result), 34);
});
