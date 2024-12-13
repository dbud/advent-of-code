import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      3   4
      4   3
      2   5
      1   3
      3   9
      3   3
    `),
    11,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
      3   4
      4   3
      2   5
      1   3
      3   9
      3   3
    `),
    31,
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
