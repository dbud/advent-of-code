open Core
open Parser

let solve (input : string) : string =
  let (ranges, ids) = parse input in
  List.count ids ~f:(fun id ->
    List.exists ranges ~f:(fun (a, b) -> a <= id && id <= b)
  )
  |> string_of_int
