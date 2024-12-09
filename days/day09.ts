type Block = number | ".";

function parseInput(input: string): Block[] {
  const numbers = input.split("").map(Number);
  const blocks: Block[] = [];
  let fileId = 0;

  for (let i = 0; i < numbers.length; i++) {
    const length = numbers[i];
    if (i % 2 === 0) {
      blocks.push(...Array(length).fill(fileId));
      fileId++;
    } else {
      blocks.push(...Array(length).fill("."));
    }
  }

  return blocks;
}

function calculateChecksum(blocks: Block[]): number {
  let checksum = 0;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (typeof block === "number") {
      checksum += i * block;
    }
  }
  return checksum;
}

export function partOne(input: string) {
  const blocks = parseInput(input);

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = blocks.length - 1; i >= 0; i--) {
      if (typeof blocks[i] === "number") {
        const freeSpaceIndex = blocks.findIndex((block) => block === ".");

        if (freeSpaceIndex !== -1 && freeSpaceIndex < i) {
          blocks[freeSpaceIndex] = blocks[i];
          blocks[i] = ".";
          changed = true;
        }
      }
    }
  }

  return calculateChecksum(blocks);
}

export function partTwo(input: string) {
  const blocks = parseInput(input);
  const fileCount =
    Math.max(...blocks.filter((b): b is number => typeof b === "number")) + 1;

  for (let currentId = fileCount - 1; currentId >= 0; currentId--) {
    // Find current file position and length
    const fileStart = blocks.indexOf(currentId);
    if (fileStart === -1) continue;

    const fileLength = blocks.filter((b) => b === currentId).length;

    // Find best free space position
    let bestFreeStart = -1;
    let currentFreeStart = -1;
    let currentFreeLength = 0;

    for (let i = 0; i < fileStart; i++) {
      if (blocks[i] === ".") {
        if (currentFreeStart === -1) currentFreeStart = i;
        currentFreeLength++;

        if (currentFreeLength >= fileLength) {
          bestFreeStart = currentFreeStart;
          break;
        }
      } else {
        currentFreeStart = -1;
        currentFreeLength = 0;
      }
    }

    // Move file if suitable space found
    if (bestFreeStart !== -1) {
      const fileBlocks = blocks.splice(fileStart, fileLength);
      blocks.splice(fileStart, 0, ...Array(fileLength).fill("."));
      blocks.splice(bestFreeStart, fileLength);
      blocks.splice(bestFreeStart, 0, ...fileBlocks);
    }
  }

  return calculateChecksum(blocks);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day09.txt`);
  assertEquals(partOne(result), 1928); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day09.txt`);
  assertEquals(partTwo(result), 2858);
});
