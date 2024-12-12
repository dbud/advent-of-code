import { sum } from "jsr:@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[number, number, number[]]> {
  const grid = (await Array.fromAsync(input)).map((line) =>
    [...line].map(Number)
  );
  return [grid.length, grid[0].length, grid.flat()];
}

const adjacent = (n: number, m: number) => (idx: number) => {
  const j = idx % n, i = (idx - j) / n;
  return [[i - 1, j], [i + 1, j], [i, j - 1], [i, j + 1]]
    .filter(([i, j]) => i >= 0 && i < n && j >= 0 && j < m)
    .map(([i, j]) => i * n + j);
};

const max = 9;

export async function part1(input: ReadableStream<string>) {
  const [n, m, map] = await parse(input);

  const trailends = map.map((h, idx) => new Set(h === max ? [idx] : []));

  const queue: number[] = [];
  map.forEach((h, idx) => {
    if (h === max) queue.push(idx);
  });

  while (queue.length > 0) {
    const idx = queue.shift() as number;
    for (const adj of adjacent(n, m)(idx)) {
      if (map[adj] === map[idx] - 1) {
        for (const t of trailends[idx]) trailends[adj].add(t);
        if (!queue.includes(adj)) queue.push(adj);
      }
    }
  }

  return sum(map.map((h, idx) => h === 0 ? trailends[idx].size : 0));
}

export async function part2(input: ReadableStream<string>) {
  const [n, m, map] = await parse(input);

  const paths = map.map((h) => h === max ? 1 : 0);

  const queue: number[] = [];
  map.forEach((h, idx) => {
    if (h === max) queue.push(idx);
  });

  while (queue.length > 0) {
    const idx = queue.shift() as number;
    for (const adj of adjacent(n, m)(idx)) {
      if (map[adj] === map[idx] - 1) {
        paths[adj] += paths[idx];
        if (!queue.includes(adj)) queue.push(adj);
      }
    }
  }

  return sum(map.map((h, idx) => h === 0 ? paths[idx] : 0));
}
