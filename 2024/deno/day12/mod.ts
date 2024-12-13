import { range, sum } from "@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[number, number, string]> {
  const map = await Array.fromAsync(input);
  return [map.length, map[0].length, map.join("")];
}

const adjacent = (n: number, m: number) => (idx: number) => {
  const j = idx % n, i = (idx - j) / n;
  return [[i - 1, j], [i, j + 1], [i + 1, j], [i, j - 1]]
    .filter(([i, j]) => i >= 0 && i < n && j >= 0 && j < m)
    .map(([i, j]) => i * n + j);
};

function* regions(n: number, m: number, map: string) {
  const unvisited = new Set(range(n * m));
  while (unvisited.size > 0) {
    const idx = unvisited.keys().next().value as number;

    const region = new Set<number>();
    const queue = [idx];
    while (queue.length > 0) {
      const cur = queue.shift() as number;
      region.add(cur);
      unvisited.delete(cur);
      adjacent(n, m)(cur)
        .filter((i) =>
          map[i] === map[cur] &&
          unvisited.has(i) &&
          !queue.includes(i)
        )
        .forEach((i) => queue.push(i));
    }

    yield region;
  }
}

export async function part1(input: ReadableStream<string>) {
  const [n, m, map] = await parse(input);

  return sum(
    regions(n, m, map).map((region) => {
      const perimeter = 4 * region.size - sum(
        region.keys().map((i) =>
          adjacent(n, m)(i).filter((j) => region.has(j)).length
        ).toArray(),
      );
      return region.size * perimeter;
    }).toArray(),
  );
}

type Vec = [[number, number], [number, number]];

const sidesOf = (n: number, _m: number) => (idx: number): Vec[] => {
  const j = idx % n, i = (idx - j) / n;
  return [
    [[i, j], [i, j + 1]],
    [[i, j + 1], [i + 1, j + 1]],
    [[i + 1, j + 1], [i + 1, j]],
    [[i + 1, j], [i, j]],
  ];
};

function join(sides: Vec[]): Vec[] {
  const segments: Vec[] = [];
  const unvisited = new Set(range(sides.length));
  while (unvisited.size > 0) {
    const idx = unvisited.keys().next().value as number;

    const [[a, b], [c, d]] = sides[idx];
    const [di, dj] = [c - a, d - b];

    let forward = idx;
    while (true) {
      unvisited.delete(forward);
      const [_, [a, b]] = sides[forward];
      const next = sides.findIndex(([[e, f], [g, h]]) =>
        a === e && b === f && (g - e === di) && (h - f === dj)
      );
      if (next === -1) break;
      else forward = next;
    }
    const [_1, end] = sides[forward];

    let backward = idx;
    while (true) {
      unvisited.delete(backward);
      const [[a, b], _] = sides[backward];
      const prev = sides.findIndex(([[e, f], [g, h]]) =>
        a === g && b === h && (g - e === di) && (h - f === dj)
      );
      if (prev === -1) break;
      else backward = prev;
    }
    const [begin, _2] = sides[backward];

    segments.push([begin, end]);
  }
  return segments;
}

export async function part2(input: ReadableStream<string>) {
  const [n, m, map] = await parse(input);

  return sum(
    regions(n, m, map).map((region) => {
      const sides = region.keys().flatMap(sidesOf(n, m)).toArray();
      const exterior = sides.filter(([[a, b], [c, d]]) =>
        !sides.find(([[e, f], [g, h]]) =>
          a === g && b === h && c === e && d === f
        )
      );
      const segments = join(exterior);

      return segments.length * region.size;
    }).toArray(),
  );
}
