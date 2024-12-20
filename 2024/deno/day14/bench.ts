import { TextLineStream } from "@std/streams/text-line-stream";
import { basename } from "@std/path";
import { part1, part2 } from "./mod.ts";

const input = async () =>
  (await Deno.open("input.txt"))
    .readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

const day = basename(Deno.cwd()).padStart(5, " ");

Deno.bench(`${day} part1`, async () => {
  await part1(await input());
});

Deno.bench(`${day} part2`, async () => {
  await part2(await input());
});
