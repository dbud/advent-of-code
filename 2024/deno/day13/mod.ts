import { chunk, take } from "@es-toolkit/es-toolkit";
import { None, Option, Some } from "@seacrest/option-result-rs";

async function parse(input: ReadableStream<string>) {
  return chunk(await Array.fromAsync(input), 4)
    .map((block) =>
      take(block, 3)
        .map((line: string) => {
          const [_1, x, _2, y] = line.split(/\+|=|,/);
          return [x, y].map(Number);
        })
    );
}

const divrem = (a: number, b: number) => [Math.floor(a / b), a % b];

function solve(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  x: number,
  y: number,
): Option<[number, number]> {
  // s * ax + t * bx = x
  // s * ay + t * by = y
  const d = ax * by - bx * ay;
  const ds = x * by - y * bx;
  const dt = -x * ay + y * ax;
  const [s, srem] = divrem(ds, d);
  const [t, trem] = divrem(dt, d);
  if (srem === 0 && trem === 0 && s >= 0 && t >= 0) {
    return Some([s, t]);
  } else {
    return None();
  }
}

export async function part1(input: ReadableStream<string>) {
  let cost = 0;
  for (const [[ax, ay], [bx, by], [x, y]] of await parse(input)) {
    solve(ax, ay, bx, by, x, y).map(([s, t]) => {
      cost += s * 3 + t;
    });
  }
  return cost;
}

export async function part2(input: ReadableStream<string>) {
  const offset = 10000000000000;
  let cost = 0;
  for (const [[ax, ay], [bx, by], [x, y]] of await parse(input)) {
    solve(ax, ay, bx, by, x + offset, y + offset).map(([s, t]) => {
      cost += s * 3 + t;
    });
  }
  return cost;
}
