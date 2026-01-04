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

let length = 12

let find_next start stop lst =
  let slice = List.slice lst start stop in
  let e, idx = max_with_index slice in
  (e, idx + start)

let find_digits lst =
  let n = List.length lst in
  let rec loop i j l =
    if l >= length then []
    else
      let fst, fst_idx = find_next i j lst in
      fst :: loop (fst_idx + 1) (j + 1) (l + 1)
  in
  loop 0 (n - length + 1) 0

let to_int digits =
  List.rev digits
  |> List.fold
    ~init:(0, 1)
    ~f:(fun (acc, pow) e -> acc + e * pow, pow * 10)
  |> fst

let solve_line line =
  line |> find_digits |> to_int

let solve (input : string) : string =
  parse input
  |> List.map ~f:solve_line
  |> List.sum (module Int) ~f:Fn.id
  |> Int.to_string
