import { join } from "@std/path";
import { groupBy } from "@es-toolkit/es-toolkit";
import { createCanvas } from "@gfx/canvas";

async function parse(input: ReadableStream<string>) {
  return (await Array.fromAsync(input))
    .map((line) => {
      const [_1, px, py, _2, vx, vy] = line.split(/\s|=|,/);
      return [px, py, vx, vy].map(Number);
    });
}

const wrap = (x: number, a: number) => {
  const r = x % a;
  return r >= 0 ? r : r + a;
};

export async function part1(input: ReadableStream<string>, isTest = false) {
  const [cols, rows] = isTest ? [11, 7] : [101, 103];
  const t = 100;

  const positions = (await parse(input)).map((
    [px, py, vx, vy],
  ) => [
    wrap(px + vx * t, cols),
    wrap(py + vy * t, rows),
  ]);
  const quadrants = groupBy(
    positions,
    ([x, y]) =>
      `${Math.sign(x - Math.floor(cols / 2))}:${
        Math.sign(y - Math.floor(rows / 2))
      }`,
  );

  return quadrants["1:1"].length *
    quadrants["1:-1"].length *
    quadrants["-1:-1"].length *
    quadrants["-1:1"].length;
}

export async function part2(input: ReadableStream<string>) {
  const maxSeconds = 10000;
  const cellSize = 20, threshold = 0.2;
  const [cols, rows] = [101, 103];
  const scale = 4;
  const output = "timelapse";
  const init = await parse(input);

  try {
    await Deno.mkdir(output);
  } catch (_e) { /* okay if exists */ }

  for (let t = 1; t <= maxSeconds; t++) {
    const positions = init.map(([px, py, vx, vy]) => [
      wrap(px + vx * t, cols),
      wrap(py + vy * t, rows),
    ]);

    // collect points to cells of cellSize
    const cells = [];
    const n = Math.ceil(rows / cellSize);
    for (const [x, y] of positions) {
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      const idx = cx + cy * n;
      if (cells[idx] == null) cells[idx] = 1;
      else cells[idx]++;
    }
    // filter moderately filled clusters
    const filled = cells.filter((x) =>
      x && x / cellSize / cellSize > threshold
    );
    if (filled.length === 0) continue;

    console.log(t);

    // draw position and save image
    const canvas = createCanvas(cols * scale, rows * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    for (const [x, y] of positions) {
      ctx.fillRect(scale * x, scale * y, scale, scale);
    }
    canvas.save(join(
      output,
      t.toString().padStart(5, "0") + ".png",
    ));
  }
}
