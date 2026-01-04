open Core
open Parser

let all_chunks_equal ~n s =
  let len = String.length s in
  if len % n <> 0 then false else
  let chunk_len = len / n in
  let chunks =
    List.init n ~f:(fun i ->
      String.sub s ~pos:(i * chunk_len) ~len:chunk_len
    )
  in
  match chunks with
  | [] -> false
  | first :: rest -> List.for_all rest ~f:(String.equal first)

let is_invalid_id n =
  let s = Int.to_string n in
  let len = String.length s in
  List.exists
    (List.range 1 (len / 2 + 1))
    ~f:(fun chunk_len ->
      let n_chunks = len / chunk_len in
      len % chunk_len = 0 && all_chunks_equal ~n:n_chunks s
    )

let invalid_in_range a b =
  List.range a (b + 1)
  |> List.filter ~f:is_invalid_id
  |> List.fold ~init:0 ~f:(+)

let solve (input : string) : string =
  let ranges = parse input in
  let total =
      List.fold ranges ~init:0 ~f:(fun acc (a, b) ->
        acc + invalid_in_range a b
      )
    in
  Int.to_string total
