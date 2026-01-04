open Core
open Lib_day2

let run name f input expected =
  let actual = f input in
  if Stdlib.(actual <> expected) then (
    Printf.eprintf
      "%s failed\nexpected: %s\ngot:      %s\n\n"
      name expected actual;
    exit 1
  ) else
    Printf.printf "ok %s\n" name

let trim s = s
  |> String.split_lines
  |> List.map ~f:String.strip
  |> String.concat ~sep:"\n"

let () =
  run
    "part1 test"
    Solve1.solve
    (trim "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124")
    "1227775554";

  run
    "part2 test"
    Solve2.solve
    (trim "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124")
    "4174379265";
