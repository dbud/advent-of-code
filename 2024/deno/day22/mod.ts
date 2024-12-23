import { drop, zip } from "@es-toolkit/es-toolkit";

async function parse(input: ReadableStream<string>) {
  return (await Array.fromAsync(input)).map(BigInt);
}

const N = (1n << 24n) - 1n;
const STEPS = 2000;

const next = (a: bigint) => {
  const x = ((a << 6n) ^ a) & N;
  const y = ((x >> 5n) ^ x) & N;
  const z = ((y << 11n) ^ y) & N;
  return z;
};

export async function part1(input: ReadableStream<string>) {
  const init = await parse(input);
  let sum = 0n;
  for (let a of init) {
    for (let i = 0; i < STEPS; i++) a = next(a);
    sum += a;
  }
  return sum;
}

function* secrets(a: bigint): Generator<number> {
  while (true) {
    yield Number(a % 10n);
    a = next(a);
  }
}

function* diffs(seq: number[]): Generator<number> {
  let [prev, ...rest] = seq;
  for (const a of rest) {
    yield a - prev;
    prev = a;
  }
}

const tuples = (n: number) =>
  function* <T>(seq: Array<T>): Generator<T[]> {
    const tuple = [];
    for (let k = 0; k < n; k++) tuple.push(seq.shift()!);
    yield [...tuple];
    for (const a of seq) {
      tuple.shift();
      tuple.push(a);
      yield [...tuple];
    }
  };

export async function part2(input: ReadableStream<string>) {
  const buyers = await parse(input);

  const keys = new Set<string>();
  const maps: Map<string, number>[] = [];

  for (const init of buyers) {
    const prices = secrets(init).take(STEPS).toArray();

    const m = new Map<string, number>();
    for (
      const [price, change] of zip(
        drop(prices, 4),
        tuples(4)(diffs(prices).toArray()).toArray(),
      )
    ) {
      const key = change.toString();
      if (!m.has(key)) m.set(key, price);
      keys.add(key);
    }
    maps.push(m);
  }

  let max = -Infinity;
  for (const key of keys) {
    let sum = 0;
    for (const map of maps) sum += map.get(key) ?? 0;
    if (sum >= max) max = sum;
  }
  return max;
}
