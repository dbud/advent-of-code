open Core
open Alcotest

let trim s = s
  |> String.split_lines
  |> List.map ~f:String.strip
  |> String.concat ~sep:"\n"

let test name f input expected =
  let test_fun () =
    let actual = f (trim input) in
    let expected = expected in
    Alcotest.check string name expected actual
  in
  Alcotest.test_case name `Quick test_fun

let test_all day tests =
  Alcotest.run "AoC tests" [(day, tests)]
