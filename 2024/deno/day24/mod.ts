type GateType = "AND" | "OR" | "XOR";
type Gate = { x: string; y: string; type: GateType; z: string };

type Input = {
  values: Map<string, number>;
  gates: Gate[];
};

async function parse(input: ReadableStream<string>): Promise<Input> {
  const values = new Map<string, number>();
  const gates = new Array<Gate>();

  let wires = true;
  for await (const line of input) {
    if (!line) {
      wires = false;
      continue;
    }
    if (wires) {
      const [w, v] = line.split(/:\s+/);
      values.set(w, Number(v));
    } else {
      const [_, x, type, y, z] = line.match(
        /(\w+) (AND|OR|XOR) (\w+) -> (\w+)/,
      )!;
      gates.push({ x, y, type: type as GateType, z });
    }
  }
  return { values, gates };
}

function toposort({ values, gates }: Input): string[] {
  const indegree = new Map<string, number>([
    // ...values.keys().map((w) => [w, 0]),
    ...gates.map(({ z }) => [z, 2]),
  ] as [string, number][]);

  const sorted = [];
  const queue = values.keys().toArray();
  while (queue.length > 0) {
    const a = queue.shift()!;
    sorted.push(a);
    gates.filter(({ x, y }) => x === a || y === a).forEach(({ z }) => {
      const d = indegree.get(z)! - 1;
      indegree.set(z, d);
      if (d === 0) queue.push(z);
    });
  }
  return sorted;
}

function evaluate({ values, gates }: Input, sorted: string[]) {
  const gateByZ = new Map<string, Gate>(gates.map((gate) => [gate.z, gate]));
  for (const z of sorted) {
    if (values.has(z)) continue;
    const { x, y, type } = gateByZ.get(z)!;
    const vx = values.get(x)!;
    const vy = values.get(y)!;
    const vz = (type === "AND") ? (vx & vy) : (
      (type === "OR") ? (vx | vy) : (vx ^ vy)
    );
    values.set(z, vz);
  }
}

function getValue(values: Map<string, number>, prefix: string): number[] {
  return values.entries()
    .filter(([name, _]) => name.startsWith(prefix))
    .map(([name, value]) => [Number(name.slice(prefix.length)), value])
    .toArray()
    .toSorted(([a, _1], [b, _2]) => a - b)
    .map(([_, value]) => value);
}

function asBigInt(bits: number[]): bigint {
  let answer = 0n, p = 1n;
  for (const bit of bits) {
    if (bit === 1) answer += p;
    p <<= 1n;
  }
  return answer;
}

export async function part1(input: ReadableStream<string>) {
  const { values, gates } = await parse(input);

  const sorted = toposort({ values, gates });
  evaluate({ values, gates }, sorted);
  return asBigInt(getValue(values, "z"));
}

export async function part2(_input: ReadableStream<string>) {}
