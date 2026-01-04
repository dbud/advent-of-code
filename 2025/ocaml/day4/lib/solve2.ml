open Core
open Parser

let adj (x, y) (x', y') =
  (x <> x' || y <> y') &&
  abs(x - x') <= 1 && abs(y - y') <= 1

let neighbours (x, y) cells =
  List.filter cells ~f:(fun (x', y') -> adj (x, y) (x', y'))

let reachable (x, y) cels =
  List.length (neighbours (x, y) cels) < 4

let solve (input : string) : string =
  let cells = parse input in
  let rec remove removed cells =
    let (reached, rest) = List.partition_tf cells ~f:(fun (x, y) -> reachable (x, y) cells) in
    if List.is_empty reached then removed else remove (removed @ reached) rest
  in
  remove [] cells
  |> List.length
  |> string_of_int
