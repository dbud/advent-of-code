(* open Core *)
open Angstrom

let parser = return ()

let parse input =
  match parse_string ~consume:All parser input with
  | Ok r -> r
  | Error e -> failwith e
