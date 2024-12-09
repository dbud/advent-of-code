import { sum, zip } from "jsr:@es-toolkit/es-toolkit";

const parse = async (input: ReadableStream<string>) => {
  const a = [], b = [];
  for await (const line of input) {
    const [x, y] = line.split(/\s+/).map((x) => parseInt(x, 10));
    a.push(x);
    b.push(y);
  }
  return [a, b];
};

export async function part1(input: ReadableStream<string>) {
  const [a, b] = await parse(input);
  a.sort();
  b.sort();

  return sum(
    zip(a, b)
      .map(([x, y]) => Math.abs(x - y)),
  );
}

export async function part2(input: ReadableStream<string>) {
  const [a, b] = await parse(input);

  const f = new Map();
  for (const x of b) {
    if (f.has(x)) f.set(x, f.get(x) + 1);
    else f.set(x, 1);
  }

  return sum(
    a.map((x) => x * (f.get(x) ?? 0)),
  );
}
