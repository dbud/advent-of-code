open Core
open Parser

let max_with_index lst =
  match lst with
  | [] -> failwith "Empty list"
  | x :: xs ->
    List.foldi xs
      ~init:(x, 0)
      ~f:(fun i (max_val, max_idx) e ->
        if e > max_val then (e, i + 1) else (max_val, max_idx)
      )

let solve_line line =
  let n = List.length line in
  let but_last = List.slice line 0 (n - 1) in
  let fst, fst_idx = max_with_index but_last in
  let rest = List.slice line (fst_idx + 1) n in
  let snd, _ = max_with_index rest in
  10 * fst + snd

let solve (input : string) : string =
  parse input
  |> List.map ~f:solve_line
  |> List.sum (module Int) ~f:Fn.id
  |> Int.to_string
