import { assertEquals } from "jsr:@std/assert";
import { TextLineStream } from "jsr:@std/streams/text-line-stream";
import { dedent } from "jsr:@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function example1_part1() {
  assertEquals(
    await part1(from`\
      AAAA
      BBCD
      BBCC
      EEEC
    `),
    140,
  );
});

Deno.test(async function example2_part1() {
  assertEquals(
    await part1(from`\
      OOOOO
      OXOXO
      OOOOO
      OXOXO
      OOOOO
    `),
    772,
  );
});

Deno.test(async function example3_part1() {
  assertEquals(
    await part1(from`\
      RRRRIICCFF
      RRRRIICCCF
      VVRRRCCFFF
      VVRCCCJFFF
      VVVVCJJCFE
      VVIVCCJJEE
      VVIIICJJEE
      MIIIIIJJEE
      MIIISIJEEE
      MMMISSJEEE
    `),
    1930,
  );
});

Deno.test(async function example1_part2() {
  assertEquals(
    await part2(from`\
      AAAA
      BBCD
      BBCC
      EEEC
    `),
    80,
  );
});

Deno.test(async function example2_part2() {
  assertEquals(
    await part2(from`\
      OOOOO
      OXOXO
      OOOOO
      OXOXO
      OOOOO
    `),
    436,
  );
});

Deno.test(async function example3_part2() {
  assertEquals(
    await part2(from`\
      EEEEE
      EXXXX
      EEEEE
      EXXXX
      EEEEE
    `),
    236,
  );
});

Deno.test(async function example4_part2() {
  assertEquals(
    await part2(from`\
      AAAAAA
      AAABBA
      AAABBA
      ABBAAA
      ABBAAA
      AAAAAA
    `),
    368,
  );
});

Deno.test(async function example5_part2() {
  assertEquals(
    await part2(from`\
      RRRRIICCFF
      RRRRIICCCF
      VVRRRCCFFF
      VVRCCCJFFF
      VVVVCJJCFE
      VVIVCCJJEE
      VVIIICJJEE
      MIIIIIJJEE
      MIIISIJEEE
      MMMISSJEEE
    `),
    1206,
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
