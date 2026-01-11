let input = "123 328  51 64
 45 64  387 23
  6 98  215 314
*   +   *   +
"
in
Helpers.(test_all "day6" Lib_day6.[
  test "part1" Solve1.solve input "4277556";
  test "part2" Solve2.solve input "3263827";
])
