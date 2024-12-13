import { assertEquals } from "@std/assert";
import { TextLineStream } from "@std/streams/text-line-stream";
import { dedent } from "@qnighy/dedent";

import { part1, part2 } from "./mod.ts";

Deno.test(async function examplePart1() {
  assertEquals(
    await part1(from`\
      Button A: X+94, Y+34
      Button B: X+22, Y+67
      Prize: X=8400, Y=5400

      Button A: X+26, Y+66
      Button B: X+67, Y+21
      Prize: X=12748, Y=12176

      Button A: X+17, Y+86
      Button B: X+84, Y+37
      Prize: X=7870, Y=6450

      Button A: X+69, Y+23
      Button B: X+27, Y+71
      Prize: X=18641, Y=10279
    `),
    480,
  );
});

Deno.test(async function examplePart2() {
  assertEquals(
    await part2(from`\
      Button A: X+94, Y+34
      Button B: X+22, Y+67
      Prize: X=8400, Y=5400

      Button A: X+26, Y+66
      Button B: X+67, Y+21
      Prize: X=12748, Y=12176

      Button A: X+17, Y+86
      Button B: X+84, Y+37
      Prize: X=7870, Y=6450

      Button A: X+69, Y+23
      Button B: X+27, Y+71
      Prize: X=18641, Y=10279
    `),
    875318608908,
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
