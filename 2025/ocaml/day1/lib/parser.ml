open Core
open Angstrom

type dir = L | R [@@deriving sexp_of]
type rotation = { dir: dir; distance: int } [@@deriving sexp_of]

let dir = (char 'L' *> return L <|> char 'R' *> return R)

let distance = take_while1 Char.is_digit >>| int_of_string

let rotation = lift2 (fun dir distance -> { dir; distance }) dir distance

let rotations = sep_by1 (char '\n') rotation

let parse = Helpers.parse rotations
