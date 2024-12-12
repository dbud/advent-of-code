import { toText } from "jsr:@std/streams/to-text";
import { sum } from "jsr:@es-toolkit/es-toolkit";

async function parse(input: ReadableStream<string>) {
  return (await toText(input)).split(/\s+/).map(Number);
}

function count(n: number, depth: number): number {
  if (depth === 0) return 1;

  if (n === 0) return count(1, depth - 1);

  const s = n.toString();
  if (s.length % 2 === 0) {
    const l = Number(s.slice(0, s.length / 2));
    const r = Number(s.slice(s.length / 2));
    return count(l, depth - 1) + count(r, depth - 1);
  } else return count(n * 2024, depth - 1);
}

export async function part1(input: ReadableStream<string>) {
  const numbers = await parse(input);
  const answer = sum(numbers.map((n) => count(n, 25)));
  return answer;
}

const add = (m: Map<number, number>, n: number, k: number = 1) =>
  m.set(n, (m.get(n) ?? 0) + k);

function init(numbers: number[]): Map<number, number> {
  const m = new Map();
  for (const n of numbers) add(m, n, 1);
  return m;
}

function iterate(numbers: Map<number, number>): Map<number, number> {
  const m = new Map();
  for (const [n, k] of numbers) {
    if (n === 0) {
      add(m, 1, k);
    } else {
      const s = n.toString();
      if (s.length % 2 === 0) {
        const l = Number(s.slice(0, s.length / 2));
        add(m, l, k);
        const r = Number(s.slice(s.length / 2));
        add(m, r, k);
      } else {
        add(m, n * 2024, k);
      }
    }
  }
  return m;
}

export async function part2(input: ReadableStream<string>) {
  const numbers = await parse(input);

  let counts = init(numbers);
  for (let i = 0; i < 75; i++) {
    counts = iterate(counts);
  }

  const answer = sum(counts.values().toArray());
  return answer;
}
