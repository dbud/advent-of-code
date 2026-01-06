open Core
open Angstrom

let parse_grid =
  let rec loop row col acc =
    peek_char >>= function
    | None -> return acc
    | Some '\n' -> advance 1 >>= fun () -> loop (row + 1) 0 acc
    | Some '@'  -> advance 1 >>= fun () -> loop row (col + 1) ((row,col)::acc)
    | Some '.'  -> advance 1 >>= fun () -> loop row (col + 1) acc
    | Some c    -> fail ("Unexpected char: " ^ Char.to_string c)
  in
  loop 0 0 []

let parse = Helpers.parse parse_grid
