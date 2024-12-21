import { sum } from "@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[number, number[]][]> {
  return (await Array.fromAsync(input))
    .map((line) => line.split(/:?\s+/).map(Number))
    .map(([target, ...values]) => [target, values]);
}

function* combinations<T>(elements: T[], n: number): Generator<T[]> {
  const k = elements.length;
  const idx = new Array(n).fill(0);
  while (n > 0) {
    yield idx.map((i) => elements[i]);
    idx[0]++;
    for (let i = 0; i < n - 1; i++) {
      if (idx[i] === k) {
        idx[i] = 0;
        idx[i + 1]++;
      }
    }
    if (idx.at(-1) === k) return;
  }
}

function concat(lhs: number, rhs: number) {
  let p = 1;
  while (p <= rhs) p *= 10;
  return lhs * p + rhs;
}

function evaluate(values: number[], ops: string[]): number {
  let acc = values[0];
  for (let i = 0; i < ops.length; i++) {
    switch (ops[i]) {
      case "+":
        acc += values[i + 1];
        break;
      case "*":
        acc *= values[i + 1];
        break;
      case "||":
        acc = concat(acc, values[i + 1]);
        break;
    }
  }
  return acc;
}

const solveWith = (ops: string[]) =>
  function (equations: [number, number[]][]) {
    return sum(
      equations
        .filter(([target, values]) =>
          combinations(ops, values.length - 1)
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
