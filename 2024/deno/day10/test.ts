import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      89010123
      78121874
      87430965
      96549874
      45678903
      32019012
      01329801
      10456732
    `),
    36,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
      89010123
      78121874
      87430965
      96549874
      45678903
      32019012
      01329801
      10456732
    `),
    81,
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
