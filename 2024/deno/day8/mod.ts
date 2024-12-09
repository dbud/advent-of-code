type Grid = string[][];
type Vec2 = [number, number];

function getLocations(grid: Grid): Map<string, Vec2[]> {
  const locations = new Map();
  grid.forEach((row, i) =>
    row.forEach((c, j) => {
      if (c !== ".") {
        locations.set(
          c,
          [[i, j] as Vec2].concat(locations.get(c) ?? []),
        );
      }
    })
  );
  return locations;
}

function tryMark(grid: Grid, [i, j]: Vec2): boolean {
  const [w, h] = [grid[0].length, grid.length];
  if (i >= 0 && i < w && j >= 0 && j < h) {
    grid[i][j] = "#";
    return true;
  }
  return false;
}

async function parse(input: ReadableStream<string>): Promise<Grid> {
  return (await Array.fromAsync(input))
    .map((line) => [...line]);
}

export async function part1(input: ReadableStream<string>) {
  const grid = await parse(input);

  for (const [_c, pairs] of getLocations(grid)) {
    for (const [ai, aj] of pairs) {
      for (const [bi, bj] of pairs) {
        if (ai !== bi && aj !== bj) {
          tryMark(grid, [2 * ai - bi, 2 * aj - bj]);
          tryMark(grid, [2 * bi - ai, 2 * bj - aj]);
        }
      }
    }
  }
  return grid.flat().filter((c) => c === "#").length;
}

export async function part2(input: ReadableStream<string>) {
  const grid = await parse(input);

  for (const [_c, pairs] of getLocations(grid)) {
    for (const [ai, aj] of pairs) {
      for (const [bi, bj] of pairs) {
        if (ai !== bi && aj !== bj) {
          const [vi, vj] = [ai - bi, aj - bj];
          for (let k = 0; tryMark(grid, [ai + vi * k, aj + vj * k]); k++);
          for (let k = 0; tryMark(grid, [ai - vi * k, aj - vj * k]); k++);
        }
      }
    }
  }
  return grid.flat().filter((c) => c === "#").length;
}
