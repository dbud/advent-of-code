let input = "3-5
10-14
16-20
12-18

1
5
8
11
17
32"
in
Helpers.(test_all "day5" Lib_day5.[
  test "part1" Solve1.solve input "3";
  test "part2" Solve2.solve input "14";
])
