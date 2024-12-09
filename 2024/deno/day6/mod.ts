type Vec2 = [number, number];

class Position {
  static #dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]];
  #ij: Vec2;
  #dir: number;

  constructor(p: Vec2, d: number = 0) {
    this.#ij = p;
    this.#dir = d;
  }

  turn(): Position {
    return new Position(this.#ij, (this.#dir + 1) % 4);
  }

  step(): Position {
    const [di, dj] = Position.#dirs[this.#dir];
    const [i, j] = this.#ij;
    return new Position([i + di, j + dj], this.#dir);
  }

  get ij() {
    return this.#ij;
  }
  get key() {
    return this.#ij[0] * 1e3 + this.#ij[1];
  }
  get keydir() {
    return this.#dir * 1e6 + this.#ij[0] * 1e3 + this.#ij[1];
  }
}

class Board {
  #array: string[][];
  n: number;
  m: number;

  constructor(array: string[][]) {
    this.#array = array;
    this.n = this.#array.length;
    this.m = this.#array[0].length;
  }

  static from(lines: string[]): Board {
    return new Board(lines.map((line) => [...line]));
  }

  get initial(): Position {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        if (this.#array[i][j] === "^") return new Position([i, j]);
      }
    }
    return new Position([0, 0]);
  }

  outside([i, j]: Vec2): boolean {
    return i < 0 || i >= this.n || j < 0 || j >= this.m;
  }

  obstructed([i, j]: Vec2): boolean {
    return this.#array[i][j] === "#";
  }

  *vacant() {
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.m; j++) {
        if (this.#array[i][j] === ".") {
          yield [i, j] as Vec2;
        }
      }
    }
  }

  obstruct([i, j]: Vec2): Board {
    const copy = this.#array.map((row) => [...row]);
    copy[i][j] = "#";
    return new Board(copy);
  }
}

async function parse(input: ReadableStream<string>) {
  return Board.from(await Array.fromAsync(input));
}

export async function part1(input: ReadableStream<string>) {
  const map = await parse(input);

  let pos = map.initial;
  const visited = new Set();
  while (true) {
    visited.add(pos.key);
    const ahead = pos.step();
    if (map.outside(ahead.ij)) {
      break;
    }
    if (map.obstructed(ahead.ij)) {
      pos = pos.turn();
    } else {
      pos = ahead;
    }
  }
  return visited.size;
}

function loops(map: Board): boolean {
  let pos = map.initial;
  const visited = new Set();
  while (true) {
    if (visited.has(pos.keydir)) {
      return true;
    }
    visited.add(pos.keydir);
    const ahead = pos.step();
    if (map.outside(ahead.ij)) {
      return false;
    }
    if (map.obstructed(ahead.ij)) {
      pos = pos.turn();
    } else {
      pos = ahead;
    }
  }
}

export async function part2(input: ReadableStream<string>) {
  const map = await parse(input);
  return map.vacant()
    .filter((p) => loops(map.obstruct(p)))
    .toArray().length;
}
