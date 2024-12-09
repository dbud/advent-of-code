import { TextLineStream } from "jsr:@std/streams/text-line-stream";
import { part1 } from "./mod.ts";

if (import.meta.main) {
  const input = Deno.stdin.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());
  console.log(await part1(input));
}
