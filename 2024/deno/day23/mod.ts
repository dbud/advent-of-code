type AdjMap = Map<string, Set<string>>;

async function parse(input: ReadableStream<string>) {
  const adj: AdjMap = new Map();

  const add = (from: string, to: string) =>
    adj.has(from) ? adj.get(from)!.add(to) : adj.set(from, new Set([to]));

  for await (const line of input) {
    const [a, b] = line.split("-");
    add(a, b);
    add(b, a);
  }
  return adj;
}

export async function part1(input: ReadableStream<string>) {
  const adj = await parse(input);

  let count = 0;
  for (const v of adj.keys()) {
    for (const a of adj.get(v)!) {
      for (const b of adj.get(v)!) {
        if (
          adj.get(a)?.has(b) &&
          (v.startsWith("t") || a.startsWith("t") || b.startsWith("t"))
        ) count++;
      }
    }
  }
  return count / 6;
}

function BronKerbosch(adj: AdjMap) {
  let max = new Set<string>([]);

  function find(
    current: Set<string>,
    potential: Set<string>,
    excluded: Set<string>,
  ) {
    if (potential.size === 0 && excluded.size === 0) {
      if (current.size > max.size) {
        max = current;
      }
    } else {
      for (const v of Array.from(potential)) {
        const adj_v = adj.get(v) ?? new Set();
        find(
          current.union(new Set([v])),
          potential.intersection(adj_v),
          excluded.intersection(adj_v),
        );
        potential.delete(v);
        excluded.add(v);
      }
    }
  }

  find(new Set(), new Set(adj.keys()), new Set());
  return max;
}

export async function part2(input: ReadableStream<string>) {
  return Array.from(
    BronKerbosch(await parse(input)),
  )
    .toSorted()
    .join(",");
}
