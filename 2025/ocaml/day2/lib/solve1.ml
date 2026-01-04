open Core
open Parser

let is_invalid_id n =
  let s = Int.to_string n in
  let len = String.length s in
  if len mod 2 <> 0 then
    false
  else
    let half = len / 2 in
    let left =  String.sub s ~pos:0 ~len:half in
    let right = String.sub s ~pos:half ~len:half in
    String.equal left right

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
