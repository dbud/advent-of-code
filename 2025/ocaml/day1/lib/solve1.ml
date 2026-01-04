open Core
open Parser

let wrap x = ((x mod 100) + 100) mod 100

let solve (input : string) : string =
  let rotations = parse input in
  let _, zeros =
    List.fold rotations ~init:(50,0) ~f:(fun (dial, zeros) {dir; distance} ->
      let dial =
        match dir with
        | L -> wrap (dial - distance)
        | R -> wrap (dial + distance)
      in
      let zeros = if dial = 0 then zeros + 1 else zeros in
      (dial, zeros)
    )
  in
  string_of_int zeros
