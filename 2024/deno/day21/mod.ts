import { minBy } from "@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[number, string][]> {
  return (await Array.fromAsync(input)).map(
    (chars) => [parseInt(chars, 10), chars],
  );
}

// +---+---+---+       +---+---+
// | 7 | 8 | 9 |       | ^ | A |
// +---+---+---+   +---+---+---+
// | 4 | 5 | 6 |   | < | v | > |
// +---+---+---+   +---+---+---+
// | 1 | 2 | 3 |
// +---+---+---+
//     | 0 | A |
//     +---+---+

type Vec2 = [number, number];
type Pad = Record<string, Vec2>;

function layout(chars: string) {
  const map: Pad = {};
  [...chars].forEach((c, i) => map[c] = [i % 3, Math.floor(i / 3)]);
  return map;
}
const valueAt = (pad: Pad, [at_x, at_y]: Vec2) =>
  Object.entries(pad).find(([_, [x, y]]) => x === at_x && y === at_y)![0];

const NUMPAD = layout("_0A123456789");
const DPAD = layout("<v>_^A");

const MAX_ABS = 3;
const hash = ([x, y]: Vec2) =>
  (x + MAX_ABS) + (y + MAX_ABS) * 2 * (MAX_ABS + 1);

const dist = ([x, y]: Vec2) => Math.abs(x) + Math.abs(y);

const inbounds = ([x, y]: Vec2) =>
  Math.abs(x) <= MAX_ABS && Math.abs(y) <= MAX_ABS;

const DIRECTIONS: Map<string, Vec2> = new Map([
  [">", [1, 0]],
  ["^", [0, 1]],
  ["<", [-1, 0]],
  ["v", [0, -1]],
]);
const neighbors = ([x, y]: Vec2) =>
  DIRECTIONS.entries()
    .map(([c, [dx, dy]]) => [[x + dx, y + dy], c] as [Vec2, string])
    .filter(([p, _]) =>
      inbounds(p) &&
      dist(p) > dist([x, y])
    );

const paths = (() => {
  const paths = new Map<number, Set<string>>([[hash([0, 0]), new Set([""])]]);
  const queue: Vec2[] = [[0, 0]];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const cur_paths = paths.get(hash(cur))!;
    for (const [next, c] of neighbors(cur)) {
      if (!paths.has(hash(next))) paths.set(hash(next), new Set());
      const next_paths = paths.get(hash(next))!;
      cur_paths.forEach((p) => next_paths.add(p + c));
      queue.push(next);
    }
  }

  return (pad: Pad, from: string, to: string) => {
    const [x1, y1] = pad[from];
    const [x2, y2] = pad[to];
    return Array.from(
      paths.get(hash([x2 - x1, y2 - y1]))!,
    )
      .filter(
        (path) => {
          let [x, y] = [x1, y1];
          for (const c of path) {
            const [dx, dy] = DIRECTIONS.get(c)!;
            [x, y] = [x + dx, y + dy];
            if (valueAt(pad, [x, y]) === "_") return false;
          }
          return true;
        },
      );
  };
})();

function perform_many(pad: Pad, keys: string, from: string = "A") {
  let seq = new Set<string>([""]);
  for (const to of keys) {
    const next = new Set<string>();
    const options = paths(pad, from, to);
    for (const option of options) {
      for (const prev of seq) {
        next.add(prev + option + "A");
      }
    }
    seq = next;
    from = to;
  }
  return seq;
}

function setFlatMap<T>(set: Set<T>, fn: (a: T) => Set<T>): Set<T> {
  return Array.from(set).reduce(
    (set, a) => set.union(fn(a)),
    new Set<T>(),
  );
}

export async function part1(input: ReadableStream<string>) {
  let sum = 0;
  for (const [value, keys] of await parse(input)) {
    const seq1 = perform_many(NUMPAD, keys);
    console.log(seq1.size);
    const seq2 = setFlatMap(seq1, (input) => perform_many(DPAD, input));
    console.log(seq2.size);
    const seq3 = setFlatMap(seq2, (input) => perform_many(DPAD, input));
    console.log(seq3.size);

    const shortest = minBy(Array.from(seq3), (path) => path.length)!;
    sum += value * shortest.length;
  }
  return sum;
}

export async function part2(input: ReadableStream<string>) {
  const _ = await parse(input);
}
