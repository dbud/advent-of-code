open Core
open Angstrom

let int = take_while1 Char.is_digit >>| Int.of_string
let range = lift2 (fun a b -> (a, b)) (int <* char '-') int
let ranges = sep_by1 (char ',') range
  <* skip_while Char.is_whitespace
  <* end_of_input

let parse input =
  match parse_string ~consume:All ranges input with
  | Ok ranges -> ranges
  | Error e -> failwith e
