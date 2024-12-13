import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      7 6 4 2 1
      1 2 7 8 9
      9 7 6 2 1
      1 3 2 4 5
      8 6 4 4 1
      1 3 6 7 9
    `),
    2,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
      7 6 4 2 1
      1 2 7 8 9
      9 7 6 2 1
      1 3 2 4 5
      8 6 4 4 1
      1 3 6 7 9
    `),
    4,
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
