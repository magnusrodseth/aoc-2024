interface Computer {
  registers: { A: number; B: number; C: number };
  ip: number;
  output: number[];
}

function executeInstruction(computer: Computer, program: number[]): boolean {
  if (computer.ip >= program.length) return false;

  const opcode = program[computer.ip];
  const operand = program[computer.ip + 1];

  switch (opcode) {
    case 0: // adv
      computer.registers.A = Math.trunc(
        computer.registers.A / Math.pow(2, getComboValue(computer, operand))
      );
      break;
    case 1: // bxl
      computer.registers.B ^= operand;
      break;
    case 2: // bst
      computer.registers.B = getComboValue(computer, operand) & 7;
      break;
    case 3: // jnz
      if (computer.registers.A !== 0) {
        computer.ip = operand;
        return true;
      }
      break;
    case 4: // bxc
      computer.registers.B ^= computer.registers.C;
      break;
    case 5: // out
      computer.output.push(getComboValue(computer, operand) & 7);
      break;
    case 6: // bdv
      computer.registers.B = Math.trunc(
        computer.registers.A / Math.pow(2, getComboValue(computer, operand))
      );
      break;
    case 7: // cdv
      computer.registers.C = Math.trunc(
        computer.registers.A / Math.pow(2, getComboValue(computer, operand))
      );
      break;
  }

  computer.ip += 2;
  return true;
}

function getComboValue(computer: Computer, operand: number): number {
  if (operand <= 3) return operand;
  if (operand === 4) return computer.registers.A;
  if (operand === 5) return computer.registers.B;
  if (operand === 6) return computer.registers.C;
  return 0;
}

function execute(
  program: number[],
  initialA = 0,
  initialB = 0,
  initialC = 0
): number[] {
  const computer: Computer = {
    registers: { A: initialA, B: initialB, C: initialC },
    ip: 0,
    output: [],
  };

  while (executeInstruction(computer, program)) {}

  return computer.output;
}

export function partOne(input: string): string {
  const [state, prog] = input.split("\n\nProgram: ");

  const regA = parseInt(state.match(/Register A: (\d+)/)?.[1] || "0");
  const regB = parseInt(state.match(/Register B: (\d+)/)?.[1] || "0");
  const regC = parseInt(state.match(/Register C: (\d+)/)?.[1] || "0");

  const program = prog
    .trim()
    .split(/[,\s]+/)
    .map(Number);

  return execute(program, regA, regB, regC).join(",");
}

export function partTwo(input: string): number {
  const [_, prog] = input.split("\n\nProgram: ");
  const program = prog
    .trim()
    .split(/[,\s]+/)
    .map(Number);

  let result = 0;
  // Work backwards through the program
  for (let len = program.length - 1; len >= 0; len--) {
    // For each position, multiply by 8 (since outputs are mod 8)
    result *= 8;
    const targetOutput = program.slice(len).join(",");

    // Try values until we find one that matches
    while (true) {
      const output = execute(program, result).join(",");
      if (output === targetOutput) break;
      result++;
    }
  }

  return result;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;
  assertEquals(partOne(result), "4,6,3,5,6,3,5,2,1,0");
});

Deno.test("Part Two", () => {
  const result = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;
  assertEquals(partTwo(result), 117440);
});
