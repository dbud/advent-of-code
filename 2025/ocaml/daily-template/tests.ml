open Core
open Lib__DAY

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
    (trim "")
    "";

  run
    "part2 test"
    Solve1.solve
    (trim "")
    "";
