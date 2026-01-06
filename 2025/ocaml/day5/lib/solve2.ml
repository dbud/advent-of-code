open Core
open Parser

let intersect (a, b) (a', b') =
  let l = Int.max a a' in
  let h = Int.min b b' in
  if l <= h then Some (l, h) else None

let union_ranges ranges =
  let sorted = List.sort ranges ~compare:(fun (a,_) (b,_) -> Int.compare a b) in
  let rec aux acc = function
    | [] -> (* List.rev *) acc
    | (a, b)::rest ->
      match acc with
      | [] -> aux [(a, b)] rest
      | (lo, hi)::tl ->
        if a <= hi + 1 then
          (* merge *)
          aux ((lo, Int.max hi b)::tl) rest
        else
          (* start new *)
          aux ((a, b)::acc) rest
  in
  aux [] sorted

let solve (input : string) : string =
  let (ranges, _) = parse input in
  union_ranges ranges
  |> List.fold ~init:0 ~f:(fun acc (lo, hi) -> acc + (hi - lo + 1))
  |> string_of_int
