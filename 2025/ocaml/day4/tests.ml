let input = "..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@."
in
Helpers.(test_all "day4" Lib_day4.[
  test "part1" Solve1.solve input "13";
  test "part2" Solve2.solve input "43";
])
