import "@std/dotenv/load";
import { pipe } from "@core/pipe/async/pipe";

pipe(
  Deno.args[0],
  (arg) => arg.match(/day-?(\d+)/) ?? Deno.exit(1),
  (match) => parseInt(match[1], 10),
  (day) => `https://adventofcode.com/2024/day/${day}/input`,
  (url) =>
    fetch(url, {
      headers: { Cookie: `session=${Deno.env.get("AOC_SESSION")}` },
    }),
  (response) => response.body?.pipeTo(Deno.stdout.writable),
);
