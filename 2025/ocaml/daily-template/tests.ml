let input = ""
in
Helpers.(test_all "_DAY" Lib__DAY.[
  test "part1" Solve1.solve input "";
  (* test "part2" Solve2.solve input ""; *)
])
