open Core

let parse parser input =
  let open Angstrom in
  parse_string ~consume:All
    (parser <* skip_while Char.is_whitespace)
    input
  |> function
  | Ok rotations -> rotations
  | Error err -> failwith err

let run solver =
  let input = (In_channel.read_all "input.txt") in
  let answer = solver input in
  Printf.printf "%s\n" answer

let test name f input expected =
  let open Alcotest in
  let test_fun () =
    let actual = f input in
    let expected = expected in
    check string name expected actual
  in
  test_case name `Quick test_fun

let test_all day tests =
  Alcotest.run "AoC tests" [(day, tests)]

let print_sexp sexp_of a =
  printf "%s\n" (sexp_of a |> Sexp.to_string_hum)
