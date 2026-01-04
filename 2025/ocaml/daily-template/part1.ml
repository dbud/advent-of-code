open Core
open Lib__DAY

let () =
  let input = (In_channel.read_all "input.txt") in
  let answer = Solve1.solve input in
  Printf.printf "%s\n" answer
