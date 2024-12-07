type Operator = "+" | "*" | "||";

function evaluateExpression(numbers: number[], operators: string[]): number {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    switch (operators[i]) {
      case "+":
        result += numbers[i + 1];
        break;
      case "*":
        result *= numbers[i + 1];
        break;
      case "||":
        result = parseInt(`${result}${numbers[i + 1]}`);
        break;
    }
  }
  return result;
}

function generateOperatorCombinations(
  count: number,
  operators: Operator[],
  base: number
): string[][] {
  const combinations: string[][] = [];

  for (let i = 0; i < Math.pow(base, count); i++) {
    const combination: string[] = [];
    let temp = i;
    for (let j = 0; j < count; j++) {
      combination.push(operators[temp % base]);
      temp = Math.floor(temp / base);
    }
    combinations.push(combination);
  }

  return combinations;
}

function solveEquation(line: string, operators: Operator[]): number {
  const [testValue, numbersStr] = line.split(": ");
  const numbers = numbersStr.split(" ").map(Number);
  const target = parseInt(testValue);
  const operatorCount = numbers.length - 1;

  const combinations = generateOperatorCombinations(
    operatorCount,
    operators,
    operators.length
  );

  const isValid = combinations.some(
    (ops) => evaluateExpression(numbers, ops) === target
  );

  return isValid ? target : 0;
}

export function partOne(input: string) {
  const operators: Operator[] = ["+", "*"];
  return input
    .trim()
    .split("\n")
    .map((line) => solveEquation(line, operators))
    .reduce((sum, value) => sum + value, 0);
}

export function partTwo(input: string) {
  const operators: Operator[] = ["+", "*", "||"];
  return input
    .trim()
    .split("\n")
    .map((line) => solveEquation(line, operators))
    .reduce((sum, value) => sum + value, 0);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day07.txt`);
  assertEquals(partOne(result), 3749); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day07.txt`);
  assertEquals(partTwo(result), 11387); // Replace null with expected result for Part Two
});
