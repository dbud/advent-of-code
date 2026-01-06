open Core
open Alcotest

let run solver =
  let input = (In_channel.read_all "input.txt") in
  let answer = solver input in
  Printf.printf "%s\n" answer

let test name f input expected =
  let test_fun () =
    let actual = f input in
    let expected = expected in
    Alcotest.check string name expected actual
  in
  Alcotest.test_case name `Quick test_fun

let test_all day tests =
  Alcotest.run "AoC tests" [(day, tests)]
