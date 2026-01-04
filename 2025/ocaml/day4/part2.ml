open Core
open Lib_day4

let () =
  let input = (In_channel.read_all "input.txt") in
  let answer = Solve2.solve input in
  Printf.printf "%s\n" answer
