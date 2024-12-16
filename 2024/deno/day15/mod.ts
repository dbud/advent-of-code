import { sum } from "@es-toolkit/es-toolkit";

type Vec2 = [number, number];

async function parse(input: ReadableStream<string>) {
  const lines = await Array.fromAsync(input);
  const empty = lines.indexOf("");

  let robot: Vec2 = [0, 0];
  const grid = lines.slice(0, empty)
    .map((line, y) => {
      const x = line.indexOf("@");
      if (x !== -1) robot = [x, y];
      return [...line.replace("@", ".")];
    });

  const dxdy = { "<": [-1, 0], "^": [0, -1], ">": [1, 0], "v": [0, 1] };
  const moves = Array.from(lines.slice(empty + 1).join(""))
    .map((c) => dxdy[c as keyof typeof dxdy] as Vec2);

  return { robot, grid, moves };
}

export async function part1(input: ReadableStream<string>) {
  const { robot, grid, moves } = await parse(input);

  let [x, y] = robot;
  for (const [dx, dy] of moves) {
    const [nx, ny] = [x + dx, y + dy];
    const adj = grid[ny][nx];
    if (adj === ".") {
      [x, y] = [nx, ny];
    } else if (adj === "#") {
      // no-op
    } else {
      let [ex, ey] = [nx, ny];
      while (grid[ey][ex] === "O") {
        ex += dx;
        ey += dy;
      }
      if (grid[ey][ex] === ".") {
        grid[ey][ex] = "O";
        grid[ny][nx] = ".";
        [x, y] = [nx, ny];
      }
    }
  }

  return sum(
    grid.flatMap((line, y) => line.map((c, x) => c === "O" ? x + 100 * y : 0)),
  );
}

const widen = (
  { robot, grid, moves }: { robot: Vec2; grid: string[][]; moves: Vec2[] },
) => ({
  robot: [robot[0] * 2, robot[1]],
  moves,
  grid: grid.map((line) =>
    line.flatMap((c) =>
      c === "."
        ? [".", "."]
        : (c === "#" ? ["#", "#"] : (c === "O" ? ["[", "]"] : [c]))
    )
  ),
});

export async function part2(input: ReadableStream<string>) {
  const { robot, grid, moves } = widen(await parse(input));

  let [x, y] = robot;
  for (const [dx, dy] of moves) {
    const [nx, ny] = [x + dx, y + dy];
    const adj = grid[ny][nx];
    if (adj === ".") {
      [x, y] = [nx, ny];
    } else if (adj === "#") {
      // no-op
    } else if (dy === 0) { // horizontal
      let ex = nx;
      while ("[]".includes(grid[y][ex])) ex += dx;
      if (grid[y][ex] === ".") {
        while (ex != nx) {
          grid[y][ex] = grid[y][ex - dx];
          ex -= dx;
        }
        grid[y][nx] = ".";
        x = nx;
      }
    } else { // dx === 0 // vertical
      type Box = [number, number, number];
      const boxAt = (x: number, y: number): Box =>
        grid[y][x] === "[" ? [x, x + 1, y] : [x - 1, x, y];

      (() => {
        const boxes: Box[] = [];
        const queue: Box[] = [];

        const enqueue = ([x1, x2, y]: Box) => {
          if (
            !queue.find(([ex1, ex2, ey]: Box) =>
              ex1 === x1 && ex2 === x2 && ey === y
            )
          ) queue.push([x1, x2, y]);
        };

        enqueue(boxAt(nx, ny));

        while (queue.length > 0) {
          const [x1, x2, y] = queue.shift()!;
          boxes.push([x1, x2, y]);
          if (grid[y + dy][x1] === "#" || grid[y + dy][x2] === "#") {
            return;
          }
          [x1, x2].forEach((x) => {
            if ("[]".includes(grid[y + dy][x])) {
              enqueue(boxAt(x, y + dy));
            }
          });
        }

        for (const [x1, x2, y] of boxes.toReversed()) {
          [x1, x2].forEach((x) => {
            grid[y + dy][x] = grid[y][x];
            grid[y][x] = ".";
          });
        }

        y = ny;
      })();
    }
  }

  return sum(
    grid.flatMap((line, y) => line.map((c, x) => c === "[" ? x + 100 * y : 0)),
  );
}
