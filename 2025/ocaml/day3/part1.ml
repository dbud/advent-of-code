open Core
open Lib_day3

let () =
  let input = (In_channel.read_all "input.txt") in
  let answer = Solve1.solve input in
  Printf.printf "%s\n" answer
