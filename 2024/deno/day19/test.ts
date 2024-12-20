import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      r, wr, b, g, bwu, rb, gb, br

      brwrr
      bggr
      gbbr
      rrbgbr
      ubwu
      bwurrg
      brgr
      bbrgwb
    `),
    6,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
      r, wr, b, g, bwu, rb, gb, br

      brwrr
      bggr
      gbbr
      rrbgbr
      ubwu
      bwurrg
      brgr
      bbrgwb
    `),
    16,
  );
});

export function from(
  strings: TemplateStringsArray,
  // deno-lint-ignore no-explicit-any
  ...keys: any[]
): ReadableStream<string> {
  return ReadableStream.from(
    [dedent(strings, ...keys)],
  ).pipeThrough(new TextLineStream());
}
