open Core
open Parser

let adj (x, y) (x', y') =
  (x <> x' || y <> y') &&
  abs(x - x') <= 1 && abs(y - y') <= 1

let neighbours (x, y) cells =
  List.filter cells ~f:(fun (x', y') -> adj (x, y) (x', y'))

let reachable (x, y) cels =
  List.length (neighbours (x, y) cels) < 4

let reached cells =
  List.filter cells ~f:(fun (x, y) -> reachable (x, y) cells)

let solve (input : string) : string =
  let cells = parse input in
  cells
  |> reached
  |> List.length
  |> string_of_int
