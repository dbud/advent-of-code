import { drop, sum, zip } from "jsr:@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[number, number[]][]> {
  return (await Array.fromAsync(input))
    .map((line) => line.split(/:?\s+/).map((x) => parseInt(x, 10)))
    .map(([target, ...values]) => [target, values]);
}

const combinations = <T>(elements: T[]) =>
  function* recur(n: number): Generator<T[]> {
    if (n === 0) yield [];
    else {
      for (const e of elements) {
        for (const tail of recur(n - 1)) {
          yield [e].concat(tail);
        }
      }
    }
  };

function evaluate(values: number[], ops: string[]): number {
  return zip(ops, drop(values, 1))
    .reduce((lhs, [op, rhs]) => {
      switch (op) {
        case "+":
          return lhs + rhs;
        case "*":
          return lhs * rhs;
        case "||":
          return parseInt(`${lhs}${rhs}`, 10);
        default:
          return lhs;
      }
    }, values[0]);
}

const solveWith = (ops: string[]) =>
  function (equations: [number, number[]][]) {
    return sum(
      equations
        .filter(([target, values]) =>
          combinations(ops)(values.length - 1)
            .some((ops) => evaluate(values, ops) === target)
        )
        .map(([target, _values]) => target),
    );
  };

export async function part1(input: ReadableStream<string>) {
  return solveWith(["+", "*"])(await parse(input));
}

export async function part2(input: ReadableStream<string>) {
  return solveWith(["+", "*", "||"])(await parse(input));
}
