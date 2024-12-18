type Program = number[];
type RegisterName = "A" | "B" | "C";

enum OpCode {
  DIV_A = 0, // adv - DIV A, A, COM
  XOR_B_IMM = 1, // bxl - XOR B, IMM
  MOV_B = 2, // bst - MOV B, (COM % 8)
  JNZ = 3, // jnz - JNZ IMM
  XOR_B_C = 4, // bxc - XOR B, C
  OUTPUT = 5, // out - WRITE (COM % 8)
  DIV_B = 6, // bdv - DIV B, A, COM
  DIV_C = 7, // cdv - DIV C, A, COM
}

interface Computer {
  registers: { A: number; B: number; C: number };
  ip: number;
  output: number[];
}

function executeInstruction(computer: Computer, program: Program): boolean {
  if (computer.ip >= program.length) return false;

  const opcode = program[computer.ip] as OpCode;
  const operand = program[computer.ip + 1];
  const value = getComboValue(computer, operand);

  switch (opcode) {
    case OpCode.DIV_A:
      computer.registers.A = Math.floor(
        computer.registers.A / Math.pow(2, value)
      );
      break;
    case OpCode.XOR_B_IMM:
      computer.registers.B ^= operand; // Note: uses operand directly
      break;
    case OpCode.MOV_B:
      computer.registers.B = value & 7;
      break;
    case OpCode.JNZ:
      if (computer.registers.A !== 0) {
        computer.ip = operand; // Note: uses operand directly
        return true;
      }
      break;
    case OpCode.XOR_B_C:
      computer.registers.B ^= computer.registers.C;
      break;
    case OpCode.OUTPUT:
      computer.output.push(value & 7);
      break;
    case OpCode.DIV_B:
      computer.registers.B = Math.floor(
        computer.registers.A / Math.pow(2, value)
      );
      break;
    case OpCode.DIV_C:
      computer.registers.C = Math.floor(
        computer.registers.A / Math.pow(2, value)
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
  program: Program,
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

function parseProgram(input: string): {
  program: Program;
  registers: Computer["registers"];
} {
  const [state, prog] = input.split("\n\nProgram: ");

  const registers = {
    A: parseInt(state.match(/Register A: (\d+)/)?.[1] || "0"),
    B: parseInt(state.match(/Register B: (\d+)/)?.[1] || "0"),
    C: parseInt(state.match(/Register C: (\d+)/)?.[1] || "0"),
  };

  const program = prog
    .trim()
    .split(/[,\s]+/)
    .map(Number);

  return { program, registers };
}

export function partOne(input: string): string {
  const { program, registers } = parseProgram(input);
  return execute(program, registers.A, registers.B, registers.C).join(",");
}

export function partTwo(input: string): number {
  const { program } = parseProgram(input);

  function solve(a: number, i: number): number {
    const output = execute(program, a);
    const targetOutput = program.slice(program.length - i);

    // If we found the complete match
    if (output.join(",") === program.join(",")) {
      return a;
    }

    // If this is the start or we match the suffix
    if (i === 0 || output.slice(-i).join(",") === targetOutput.join(",")) {
      // Try all possible next digits (0-7 since output is mod 8)
      for (let ni = 0; ni < 8; ni++) {
        const result = solve(8 * a + ni, i + 1);
        if (result > 0) {
          return result;
        }
      }
    }

    return 0;
  }

  return solve(0, 0);
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
