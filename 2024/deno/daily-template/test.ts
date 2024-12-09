import { assertEquals } from "jsr:@std/assert";
import { TextLineStream } from "jsr:@std/streams/text-line-stream";
import { dedent } from "jsr:@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
    `),
    undefined,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
    `),
    undefined,
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
