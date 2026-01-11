open Core
open Angstrom

let spaces = skip_many (char ' ')
let integer = take_while1 Char.is_digit >>| int_of_string
let row = many1 (spaces *> integer) <* spaces
let rows = sep_by1 end_of_line row

type op = Add | Mul [@@deriving sexp]

let op = (char '+' *> return Add) <|>
         (char '*' *> return Mul)
let op_row = many1 (spaces *> op)

let parser =
  rows <* end_of_line >>= fun rows ->
  op_row >>| fun ops ->
  (rows, ops)

let parse = Helpers.parse parser
