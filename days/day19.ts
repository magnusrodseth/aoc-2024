// Common types
type Pattern = string;
type Design = string;

// Helper function for parsing input
function parseInput(input: string) {
  const [patternsStr, designsStr] = input.split("\n\n");
  return {
    patterns: patternsStr.split(", ").map((p) => p.trim()),
    designs: designsStr
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean),
  };
}

export function partOne(input: string) {
  const { patterns, designs } = parseInput(input);

  function canMakeDesign(
    design: Design,
    availablePatterns: Pattern[]
  ): boolean {
    // Base case: if design is empty, we've successfully matched everything
    if (design === "") return true;

    // Try each pattern as a potential start of the design
    for (const pattern of availablePatterns) {
      if (design.startsWith(pattern)) {
        // If this pattern matches the start, recursively try to match the rest
        if (canMakeDesign(design.slice(pattern.length), availablePatterns)) {
          return true;
        }
      }
    }

    return false;
  }

  const possibleDesigns = designs.filter((design) =>
    canMakeDesign(design, patterns)
  );
  return possibleDesigns.length;
}

export function partTwo(input: string) {
  const { patterns, designs } = parseInput(input);

  function countWaysToMakeDesign(
    design: Design,
    availablePatterns: Pattern[],
    memo: Map<Design, number> = new Map()
  ): number {
    // Check if we've already computed this design
    if (memo.has(design)) {
      return memo.get(design)!;
    }

    // Base case: if design is empty, we've found one valid combination
    if (design === "") return 1;

    let totalWays = 0;
    // Try each pattern as a potential start of the design
    for (const pattern of availablePatterns) {
      if (design.startsWith(pattern)) {
        // If this pattern matches the start, recursively count ways for the rest
        totalWays += countWaysToMakeDesign(
          design.slice(pattern.length),
          availablePatterns,
          memo
        );
      }
    }

    // Cache the result before returning
    memo.set(design, totalWays);
    return totalWays;
  }

  return designs
    .map((design) => countWaysToMakeDesign(design, patterns))
    .reduce((sum, ways) => sum + ways, 0);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day19.txt`);
  assertEquals(partOne(result), 6);
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day19.txt`);
  assertEquals(partTwo(result), 16);
});
