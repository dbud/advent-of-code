import { drop, isEqual } from "@es-toolkit/es-toolkit";

type State = { registers: bigint[]; program: number[] };

async function parse(input: ReadableStream<string>) {
  const lines = (await Array.fromAsync(input))
    .map((line) => line.split(/:\s*/)[1]);
  const registers = lines.slice(0, 3).map(BigInt);
  const program = lines.at(-1)!.split(",").map(Number);
  return { registers, program };
}

function exec({ registers, program }: State) {
  const output = [];
  let ip = 0;
  while (ip < program.length) {
    const opcode = program[ip++];
    const literal = program[ip++];
    const combo = literal <= 3 ? BigInt(literal) : registers[literal - 4];
    switch (opcode) {
      case 0: // adv
        registers[0] = registers[0] >>= combo;
        break;
      case 1: // bxl
        registers[1] ^= BigInt(literal);
        break;
      case 2: //bxt
        registers[1] = combo & 7n;
        break;
      case 3: // jnz
        if (registers[0] !== 0n) ip = literal;
        break;
      case 4: //bxc
        registers[1] ^= registers[2];
        break;
      case 5: // out
        output.push(Number(combo & 7n));
        break;
      case 6: // bdv
        registers[1] = registers[0] >> combo;
        break;
      case 7: // cdv
        registers[2] = registers[0] >> combo;
        break;
    }
  }
  return output;
}

export async function part1(input: ReadableStream<string>) {
  return exec(await parse(input)).join(",");
}

export function part2(_input: ReadableStream<string>) {
  // 2,  4,  1,  1,  7,  5,  1,  5,  4,  3,  5,  5,  0,  3,  3,  0
  // b = a & 7
  //         b ^= 1
  //                 c = a >> b
  //                         b ^= b101
  //                                 b ^= c
  //                                         out b & 7
  //                                                 a >>= 3
  //                                                         a!=0 -> jump 0
  const program = [2, 4, 1, 1, 7, 5, 1, 5, 4, 3, 5, 5, 0, 3, 3, 0];
  const SHIFT = 3n; // a >>= 3 operation

  const stack = [0n];
  while (stack.length > 0) {
    let a = stack.pop()!;
    a *= 1n << SHIFT;
    for (let i = (1n << SHIFT) - 1n; i >= 0; i--) {
      const ai = a + BigInt(i);
      const output = exec({ program, registers: [ai, 0n, 0n] });
      const tail = drop(program, program.length - output.length);
      if (isEqual(tail, output)) {
        if (program.length === output.length) {
          return ai;
        }
        stack.push(ai);
      }
    }
  }
}
