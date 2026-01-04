open Core
open Parser

let solve (input : string) : string =
  let rotations = parse input in
  let _, zeros =
    List.fold rotations ~init:(50,0) ~f:(fun (dial, zeros) {dir; distance} ->
      let step = match dir with L -> -1 | R -> 1 in
      let zeros_hit, dial =
        let dial = ref dial in
        let zeros = ref 0 in
        for _ = 1 to distance do
          dial := !dial + step;
          if !dial mod 100 = 0 then incr zeros
        done;
        !zeros, !dial in
      (dial, zeros + zeros_hit)
    ) in
  string_of_int zeros
