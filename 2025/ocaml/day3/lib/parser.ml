open Core
open Angstrom

let digit = satisfy Char.is_digit >>| (fun c -> Int.of_string (String.of_char c))
let line = many1 digit
let lines = sep_by1 (char '\n') line
  <* skip_while Char.is_whitespace
  <* end_of_input

let parse input =
  match parse_string ~consume:All lines input with
  | Ok result -> result
  | Error e -> failwith e
