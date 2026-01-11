open Core
open Parser

let calc vs op =
  let rec calc' = function
    | [], Add -> 0
    | [], Mul -> 1
    | v :: vs, Add -> v + calc' (vs, op)
    | v :: vs, Mul -> v * calc' (vs, op)
  in calc' (vs, op)

let solve (input : string) : string =
  let rows, ops = parse input in
  let cols = List.transpose_exn rows in
  let tasks = List.zip_exn cols ops in
  let results = List.map tasks ~f:(fun (vs, op) -> calc vs op) in
  List.sum (module Int) ~f:Fn.id results
  |> string_of_int
