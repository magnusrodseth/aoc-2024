export function partOne(input: string) {
  // Regular expression to match valid mul(X,Y) patterns
  // Matches: mul followed by exactly ( then 1-3 digits, comma, 1-3 digits, and )
  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

  let sum = 0;

  // Find all matches and process them
  for (const match of input.matchAll(mulRegex)) {
    const [_, num1, num2] = match;
    sum += parseInt(num1) * parseInt(num2);
  }

  return sum;
}

export function partTwo(input: string) {
  // Regular expressions for different patterns
  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const doRegex = /do\(\)/g;
  const dontRegex = /don't\(\)/g;

  let sum = 0;
  let enabled = true; // Multiplications are enabled by default
  let lastIndex = 0;

  // Find all control instructions and multiplications
  while (lastIndex < input.length) {
    // Find the next occurrence of any pattern
    const doMatch = doRegex.exec(input);
    const dontMatch = dontRegex.exec(input);
    const mulMatch = mulRegex.exec(input);

    // Get the earliest match
    const matches = [doMatch, dontMatch, mulMatch].filter((m) => m !== null);
    if (matches.length === 0) break;

    const nextMatch = matches.reduce((a, b) => (a.index < b.index ? a : b));

    if (nextMatch === mulMatch && enabled && mulMatch) {
      // Process multiplication if enabled
      const [_, num1, num2] = mulMatch;
      sum += parseInt(num1) * parseInt(num2);
    } else if (nextMatch === doMatch) {
      enabled = true;
    } else if (nextMatch === dontMatch) {
      enabled = false;
    }

    lastIndex = nextMatch.index + 1;
    // Reset lastIndex for all regex
    doRegex.lastIndex = lastIndex;
    dontRegex.lastIndex = lastIndex;
    mulRegex.lastIndex = lastIndex;
  }

  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result =
    "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
  assertEquals(partOne(result), 161); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result =
    "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
  assertEquals(partTwo(result), 48); // Replace null with expected result for Part Two
});
