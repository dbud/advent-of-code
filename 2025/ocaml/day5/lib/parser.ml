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

let ranges_and_ids =
  lift2
    (fun ranges ids -> (ranges, ids))
    (ranges <* newline)
    ids

let parse = Helpers.parse ranges_and_ids
