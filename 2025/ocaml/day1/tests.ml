open Core
open Lib_day1

let run name f input expected =
  let actual = f input in
  if Stdlib.(actual <> expected) then (
    Printf.eprintf
      "❌ %s failed\nexpected: %s\ngot:      %s\n\n"
      name expected actual;
    exit 1
  ) else
    Printf.printf "✅ %s\n" name

let trim s = s
  |> String.split_lines
  |> List.map ~f:String.strip
  |> String.concat ~sep:"\n"

let () =
  run
    "part1 test"
    Solve1.solve
    (trim "L68
      L30
      R48
      L5
      R60
      L55
      L1
      L99
      R14
      L82")
    "3";

  run
    "part2 test"
    Solve2.solve
    (trim "L68
      L30
      R48
      L5
      R60
      L55
      L1
      L99
      R14
      L82")
    "6";
