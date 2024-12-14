import { join } from "@std/path";
import { groupBy, sum } from "@es-toolkit/es-toolkit";
import { createCanvas } from "@gfx/canvas";

type Vec2 = [number, number];
type Robot = [Vec2, Vec2];

async function parse(
  input: ReadableStream<string>,
): Promise<Robot[]> {
  return (await Array.fromAsync(input))
    .map((line) => {
      const [_1, px, py, _2, vx, vy] = line.split(/\s|=|,/).map(Number);
      return [[px, py], [vx, vy]];
    });
}

const wrap = (x: number, a: number) => {
  const r = x % a;
  return r >= 0 ? r : r + a;
};

const after = (
  init: Robot[],
  [cols, rows]: Vec2,
  t: number,
): Vec2[] =>
  init.map(([[px, py], [vx, vy]]) => [
    wrap(px + vx * t, cols),
    wrap(py + vy * t, rows),
  ]);

type Quad = "1:1" | "-1:1" | "-1:-1" | "1:-1";

const groupQuadrants = (positions: Vec2[], [cols, rows]: Vec2): Vec2[][] => {
  const [mx, my] = [Math.floor(cols / 2), Math.floor(rows / 2)];
  const groups = groupBy(
    positions,
    ([x, y]: Vec2) => `${Math.sign(x - mx)}:${Math.sign(y - my)}` as Quad,
  );
  return [groups["1:1"], groups["-1:1"], groups["-1:-1"], groups["1:-1"]];
};

const DIMENSIONS: Vec2 = [101, 103];

export async function part1(input: ReadableStream<string>, isTest = false) {
  const dimensions: Vec2 = isTest ? [11, 7] : DIMENSIONS;
  const init = await parse(input);
  const positions = after(init, dimensions, 100);
  const quadrants = groupQuadrants(positions, dimensions);
  return quadrants.reduce((p, quad) => p * quad.length, 1);
}

const SCALE = 4;
const OUTPUT_FOLDER = "timelapse";

export async function draw(t: number, positions: Vec2[]) {
  try {
    await Deno.mkdir(OUTPUT_FOLDER);
  } catch (_e) { /* okay if exists */ }

  const [cols, rows] = DIMENSIONS;
  const canvas = createCanvas(cols * SCALE, rows * SCALE);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  for (const [x, y] of positions) {
    ctx.fillRect(SCALE * x, SCALE * y, SCALE, SCALE);
  }
  canvas.save(join(
    OUTPUT_FOLDER,
    t.toString().padStart(5, "0") + ".png",
  ));
}

export async function part2(input: ReadableStream<string>) {
  const MAX_SECONDS = DIMENSIONS[0] * DIMENSIONS[1];

  const init = await parse(input);

  for (let t = 1; t <= MAX_SECONDS; t++) {
    const positions = after(init, DIMENSIONS, t);
    const quadrants = groupQuadrants(positions, DIMENSIONS);
    const counts = quadrants
      .map((quad) => quad.length)
      .toSorted((a, b) => b - a); // descending

    if (counts[0] >= sum(counts.slice(1))) {
      await draw(t, positions);
      return t;
    }
  }
}
