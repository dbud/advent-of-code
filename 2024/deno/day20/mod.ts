import { PriorityQueue } from "@mskr/data-structures";

class Graph {
  #adj: Map<string, [string, number][]> = new Map();

  addNode(node: string) {
    if (!this.#adj.has(node)) {
      this.#adj.set(node, []);
    }
  }

  addEdge(from: string, to: string, weight: number = 1) {
    this.addNode(from);
    this.#adj.get(from)!.push([to, weight]);
  }

  getAdj(node: string): [string, number][] {
    return this.#adj.get(node) ?? [];
  }
}

function dijkstra(graph: Graph, start: string, end: string) {
  const distances: Record<string, number> = {};
  const pred: Record<string, string[]> = {};

  interface State {
    node: string;
    distance: number;
  }
  const pq = new PriorityQueue<State>({
    comparator: (a, b) => a.distance - b.distance,
  });

  distances[start] = 0;
  pred[start] = [];
  pq.enqueue({ node: start, distance: 0 });

  while (!pq.isEmpty()) {
    const { node: current } = pq.dequeue();

    for (const [node, weight] of graph.getAdj(current)) {
      const newDistance = distances[current] + weight;
      // another path with the same distance
      if (newDistance === distances[node]) {
        pred[node].push(current);
      } // new shortest distance
      else if (newDistance < (distances[node] ?? Infinity)) {
        distances[node] = newDistance;
        pred[node] = [current];
        pq.enqueue({ node, distance: newDistance });
      }
    }
  }

  function* trace(node: string): Generator<string[]> {
    const queue = [[node]];
    while (queue.length > 0) {
      const path = queue.shift()!;
      const head = path[0]!;
      if (pred[head].length === 0) {
        yield path;
      } else {
        for (const next of pred[head]) {
          queue.push([next, ...path]);
        }
      }
    }
  }

  return {
    cost: distances[end],
    paths: Array.from(trace(end)),
  };
}

type Position = [number, number];

const toNode = ([x, y]: Position) => `${x}:${y}`;

const fromNode = (node: string): Position =>
  node.split(":").map(Number) as Position;

const neighbours =
  (min: number, max: number) => ([x, y]: Position): [Position, number][] => {
    const result = [];
    for (let dx = -max; dx <= max; dx++) {
      for (let dy = -max; dy <= max; dy++) {
        const m = Math.abs(dx) + Math.abs(dy);
        if (min <= m && m <= max) {
          result.push([[x + dx, y + dy], m] as [Position, number]);
        }
      }
    }
    return result;
  };

const adjacent = neighbours(1, 1);

async function parse(input: ReadableStream<string>) {
  const graph = new Graph();

  let start: Position = [0, 0];
  let end: Position = [0, 0];

  (await Array.fromAsync(input))
    .forEach((row, y, grid) => {
      Array.from(row).forEach((char, x) => {
        if (char !== "#") {
          for (const [[ax, ay], _] of adjacent([x, y])) {
            if (grid[ay][ax] !== "#") {
              graph.addEdge(toNode([x, y]), toNode([ax, ay]));
            }
          }
        }
        if (char === "S") start = [x, y];
        if (char === "E") end = [x, y];
      });
    });

  return { graph, start, end };
}

export async function part1(
  input: ReadableStream<string>,
  threshold: number = 100,
) {
  const { graph, start, end } = await parse(input);
  const { cost: base, paths } = dijkstra(graph, toNode(start), toNode(end));

  const path = paths[0]!;
  const distance = new Map(path.map((node, i) => [node, i]));

  let answer = 0;
  for (const a of path) {
    const [ax, ay] = fromNode(a);
    for (const [[bx, by], _] of neighbours(2, 2)([ax, ay])) {
      const b = toNode([bx, by]);
      const less = distance.get(a)! + 2 + (base - distance.get(b)!);
      if (base - less >= threshold) answer++;
    }
  }
  return answer;
}

export async function part2(
  input: ReadableStream<string>,
  threshold: number = 100,
) {
  const { graph, start, end } = await parse(input);
  const { cost: base, paths } = dijkstra(graph, toNode(start), toNode(end));

  const path = paths[0]!;
  const distance = new Map(path.map((node, i) => [node, i]));

  let answer = 0;
  for (const a of path) {
    const [ax, ay] = fromNode(a);
    for (const [[bx, by], dist] of neighbours(1, 20)([ax, ay])) {
      const b = toNode([bx, by]);
      const less = distance.get(a)! + dist + (base - distance.get(b)!);
      if (base - less >= threshold) answer++;
    }
  }
  return answer;
}
