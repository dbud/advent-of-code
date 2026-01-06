open Core
open Angstrom

let int = take_while1 Char.is_digit >>| Int.of_string
let range = lift2 (fun a b -> (a, b)) (int <* char '-') int
let ranges = sep_by1 (char ',') range

let parse = Helpers.parse ranges
