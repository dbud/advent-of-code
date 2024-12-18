type Vec2 = [number, number];

async function parse(input: ReadableStream<string>) {
  return (await Array.fromAsync(input))
    .map((line) => line.split(",").map(Number) as Vec2);
}

const DIMENSIONS: Vec2 = [71, 71];
const STEPS = 1024;

function bfs(
  [w, h]: Vec2,
  blocked: Vec2[],
  start: Vec2 = [0, 0],
  end: Vec2 = [w - 1, h - 1],
): number | undefined {
  const toIndex = ([x, y]: Vec2) => x + y * w;

  const blockedIdx = new Set(blocked.map(toIndex));

  const adj = ([x, y]: Vec2) =>
    [[1, 0], [0, 1], [-1, 0], [0, -1]]
      .map(([dx, dy]) => [x + dx, y + dy])
      .filter(([x, y]) => x >= 0 && x < w && y >= 0 && y < h);

  const distances = new Map<number, number>([[toIndex(start), 0]]);
  const queue: Vec2[] = [start];

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const cur = distances.get(toIndex([x, y]))!;

    for (const [ax, ay] of adj([x, y])) {
      const idx = toIndex([ax, ay]);
      if (!blockedIdx.has(idx) && !distances.has(idx)) {
        distances.set(idx, cur + 1);
        queue.push([ax, ay]);
      }
    }
  }

  return distances.get(toIndex(end));
}

export async function part1(
  input: ReadableStream<string>,
  [w, h]: Vec2 = DIMENSIONS,
  steps = STEPS,
) {
  const blocked = (await parse(input)).slice(0, steps);
  return bfs([w, h], blocked)!;
}

function search(a: number, b: number, pred: (idx: number) => boolean): number {
  let [l, r] = [a, b];
  while (l < r) {
    const m = Math.floor((l + r) / 2);
    if (pred(m)) r = m;
    else l = m + 1;
  }
  return l < b && pred(l) ? l : b;
}

export async function part2(
  input: ReadableStream<string>,
  [w, h]: Vec2 = DIMENSIONS,
) {
  const blocked = await parse(input);
  const idx = search(0, blocked.length, (idx) => {
    const part = blocked.slice(0, idx + 1);
    const path = bfs([w, h], part);
    return path == null;
  });
  const [x, y] = blocked[idx];
  return `${x},${y}`;
}
