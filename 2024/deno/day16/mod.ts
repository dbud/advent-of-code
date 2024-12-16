import { gray } from "jsr:@std/internal@^1.0.5/styles";
import { PriorityQueue } from "jsr:@mskr/data-structures";

class Graph {
  #adj: Map<string, [string, number][]> = new Map();

  addNode(node: string): void {
    if (!this.#adj.has(node)) {
      this.#adj.set(node, []);
    }
  }

  addEdge(from: string, to: string, weight: number): void {
    this.addNode(from);
    this.#adj.get(from)!.push([to, weight]);
  }

  getAdj(node: string): [string, number][] {
    return this.#adj.get(node) ?? [];
  }
}

function dijkstra(graph: Graph, start: string, end: string) {
  const distances: Record<string, number> = {};
  const paths: Record<string, string[][]> = {};

  interface State {
    node: string;
    distance: number;
  }
  const pq = new PriorityQueue<State>({
    comparator: (a, b) => a.distance - b.distance,
  });

  distances[start] = 0;
  paths[start] = [[start]];
  pq.enqueue({ node: start, distance: 0 });

  while (!pq.isEmpty()) {
    const { node: current } = pq.dequeue();

    for (const [node, weight] of graph.getAdj(current)) {
      const newDistance = distances[current] + weight;
      // another path with the same distance
      if (newDistance === distances[node]) {
        paths[node].push(...paths[current].map((path) => [...path, node]));
      } // new shortest distance
      else if (newDistance < (distances[node] ?? Infinity)) {
        distances[node] = newDistance;
        paths[node] = paths[current].map((path) => [...path, node]);
        pq.enqueue({ node, distance: newDistance });
      }
    }
  }

  return {
    cost: distances[end],
    paths: paths[end] ?? [],
  };
}

function dijkstraMany(graph: Graph, start: string, ends: string[]) {
  return ends
    .flatMap((end) => dijkstra(graph, start, end))
    .reduce(
      (min, { cost, paths }) => {
        if (cost === min.cost) return { cost, paths: min.paths.concat(paths) };
        else if (cost < min.cost) return { cost, paths };
        else return min;
      },
      { cost: Infinity, paths: [] },
    );
}

const DIRECTIONS = ["N", "E", "S", "W"] as const;
type Direction = typeof DIRECTIONS[number];

type Position = {
  x: number;
  y: number;
  dir: Direction;
};

const toNode = ({ x, y, dir }: Position) => `${x}:${y}:${dir}`;

const MOVE_COST = 1;
const TURN_COST = 1000;

function turns(a: Direction, b: Direction) {
  const d = Math.abs(DIRECTIONS.indexOf(a) - DIRECTIONS.indexOf(b));
  return d === 3 ? 1 : d;
}

function cost(a: Position, b: Position) {
  return MOVE_COST * (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) +
    TURN_COST * turns(a.dir, b.dir);
}

async function parse(input: ReadableStream<string>) {
  const graph = new Graph();

  let start: Position = { x: 0, y: 0, dir: "E" };
  let ends: Position[] = [];

  const addEdge = (a: Position, b: Position) =>
    graph.addEdge(toNode(a), toNode(b), cost(a, b));

  const addCell = ([x, y]: [number, number]) => {
    for (const da of DIRECTIONS) {
      for (const db of DIRECTIONS) {
        if (turns(da, db) === 1) {
          addEdge({ x, y, dir: da }, { x, y, dir: db });
        }
      }
    }
  };

  (await Array.fromAsync(input))
    .forEach((row, y, grid) => {
      Array.from(row).forEach((char, x) => {
        if (char !== "#") {
          addCell([x, y]);
          for (
            const [dx, dy, dir] of [
              [0, -1, "N"],
              [1, 0, "E"],
              [0, 1, "S"],
              [-1, 0, "W"],
            ] as [number, number, Direction][]
          ) {
            if (grid[y + dy][x + dx] !== "#") {
              addEdge(
                { x, y, dir },
                { x: x + dx, y: y + dy, dir },
              );
            }
          }
        }
        if (char === "S") {
          start = { x, y, dir: "E" };
        }
        if (char === "E") {
          ends = DIRECTIONS.map((dir) => ({ x, y, dir }));
        }
      });
    });

  return { graph, start, ends };
}

export async function part1(input: ReadableStream<string>) {
  const { graph, start, ends } = await parse(input);
  return dijkstraMany(graph, toNode(start), ends.map(toNode)).cost;
}

export async function part2(input: ReadableStream<string>) {
  const { graph, start, ends } = await parse(input);

  const { paths } = dijkstraMany(graph, toNode(start), ends.map(toNode));

  const visited = new Set<string>();
  for (const path of paths) {
    for (const node of path) {
      const [x, y, _] = node.split(":");
      visited.add(`${x}:${y}`);
    }
  }
  return visited.size;
}
