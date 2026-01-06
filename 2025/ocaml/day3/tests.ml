let input = "987654321111111
811111111111119
234234234234278
818181911112111"
in
Helpers.(test_all "day3" Lib_day3.[
  test "part1" Solve1.solve input "357";
  test "part2" Solve2.solve input "3121910778619";
])
