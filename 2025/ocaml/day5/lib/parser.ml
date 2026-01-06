open Core
open Angstrom

let int =
  take_while1 Char.is_digit >>| Int.of_string

let range =
  lift2
    (fun a b -> (a, b))
    (int <* char '-')
    int

let newline = char '\n'

let ranges =
  many1 (range <* newline)

let ids =
  many1 (int <* option '\n' newline)

let input_parser =
  lift2
    (fun ranges ids -> (ranges, ids))
    (ranges <* newline)
    ids

let parse input =
  match parse_string ~consume:All input_parser input with
  | Ok r -> r
  | Error e -> failwith e
