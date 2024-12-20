import { sum } from "@es-toolkit/es-toolkit";

async function parse(input: ReadableStream<string>) {
  const [patterns, _, ...designs] = await Array.fromAsync(input);
  return { patterns: patterns.split(/,\s*/), designs };
}

type Edge = [string, number];
type Automaton = Array<Edge>[];

function build(patterns: string[]): Automaton {
  const aut: Automaton = [[]];
  let n = 1;
  for (const pattern of patterns) {
    let idx = 0;
    Array.from(pattern).forEach((char, i) => {
      const last = i === pattern.length - 1;
      if (last) {
        aut[idx].push([char, 0]);
      } else {
        const edge = aut[idx].find(([c, i]) => char === c && i !== 0);
        if (edge) {
          idx = edge[1];
        } else {
          aut[idx].push([char, n]);
          aut[n] = [];
          idx = n++;
        }
      }
    });
  }
  return aut;
}

class Multiset<K> {
  #items: Map<K, number>;
  constructor(iterable: Iterable<K> = []) {
    this.#items = new Map();
    for (const i of iterable) this.add(i);
  }
  add(k: K, count: number = 1) {
    this.#items.set(k, (this.#items.get(k) ?? 0) + count);
  }
  count(k: K) {
    return this.#items.get(k) ?? 0;
  }
  has(k: K) {
    return this.#items.has(k);
  }
  *[Symbol.iterator]() {
    for (const item of this.#items) {
      yield item;
    }
  }
}

function walk(aut: Automaton, design: string): Multiset<number> {
  let cur = new Multiset([0]);
  for (const char of design) {
    const next = new Multiset<number>();
    for (const [i, count] of cur) {
      aut[i]
        .filter(([c, _]) => c === char)
        .forEach(([_, j]) => next.add(j, count));
    }
    cur = next;
  }
  return cur;
}

export async function part1(input: ReadableStream<string>) {
  const { patterns, designs } = await parse(input);
  const aut = build(patterns);

  return designs
    .filter((design) => {
      const state = walk(aut, design);
      return state.has(0);
    })
    .length;
}

export async function part2(input: ReadableStream<string>) {
  const { patterns, designs } = await parse(input);
  const aut = build(patterns);

  return sum(
    designs.map((design) => {
      const state = walk(aut, design);
      return state.count(0);
    }),
  );
}
