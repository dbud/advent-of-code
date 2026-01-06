open Core
open Angstrom

let digit = satisfy Char.is_digit >>| (fun c -> Int.of_string (String.of_char c))
let line = many1 digit
let lines = sep_by1 (char '\n') line

let parse = Helpers.parse lines
