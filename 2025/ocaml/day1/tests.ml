open Helpers
open Lib_day1

let input = "L68
    L30
    R48
    L5
    R60
    L55
    L1
    L99
    R14
    L82"

let () = test_all "day1" [
  test "part1" Solve1.solve input "3";
  test "part2" Solve2.solve input "6"
]
