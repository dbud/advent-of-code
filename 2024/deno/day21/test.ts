import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

// Deno.test(async function examplePart1() {
//   assertEquals(
//     await part1(from`\
//       029A
//       980A
//       179A
//       456A
//       379A
//     `),
//     126384,
//   );
// });

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      029A
    `),
    68 * 29,
  );
});

// Deno.test(async function examplePart1() {
//   assertEquals(
//     await part1(from`\
//       379A
//     `),
//     64 * 379,
//   );
// });

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
