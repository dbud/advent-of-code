# Advent of Code

My solutions for the [Advent of Code](http://adventofcode.com/)

## 2024
To celebrate [Deno](https://deno.com) hitting [2.0](https://deno.com/blog/v2.0), I decided to use it to solve this year’s Advent of Code.

```
Progress:
          .-----.          .------------------.
       .--'~ ~ ~|        .-' *       \  /     '-.   1 **
    .--'~  ,* ~ |        |  >o<   \_\_\|_/__/   |   2 **
.---': ~ '(~), ~|        | >@>O< o-_/.()__------|   3 **
|#..#'. ~ " ' ~ |        |>O>o<@< \____       .'|   4 **
|_.~._#'.. ~ ~ *|        | _| |_    ..\_\_ ..'* |   5 **
| ||| @  @'''...|        |...     .'  '.'''../..|   6 **
|#~~~##@# @   @ |        |/\ ''.  |    |   -/  :|   7 **
|~~..--. _____  |        |* /~\ '.|    | - /  .'|   8 **
'---'  ||[][]_\-|        |~/ * \ :|    |  *..'  |   9 **
       |------- |        |   /\ .'|    |'''~~~~~|  10 **
       |.......||        |/\ ..'  |    |   . .  |  11 **
       |  -  -  |        |''':::::|    |  .    .|  12 **
       |'. -   -|        |   :::::|    |  .'    |  13 **
       |...'..''|        |.  :::::|    |..|\..''|  14 **
       |.  ''.  |        |.. :::::|    |──┬┴┴┴┬─|  15 **
       | '.~  '.|        | :.:::::|    |──┤AoC├o|  16 **
       |. *'.~ :|        |  '.  ..|    |┬o┤ten├─|  17 **
       | '..' .'|        |   'o   |    |┘*┤yrs├─|  18 **
       | ~ ..'  |        |:.  '.  |    |─┘├┬┬┬┴─|  19 **
       |'''))   |        | o  * :.'.  .'──┘>>o<<|  20 **
.------'        '------. |          ''          |  21
| .---_ '------'_  .~' | | . |\|\ / \ /~ >@<<*<O|  22 **
```

Prerequisites:
* `brew install deno`
* `brew install just`

Daily workflow:
1. `just create day-xx` creates a new deno project for the day and downloads the input (put your session cookie into `.env` as `AOC_SESSION="..."`)
1. `just test day-xx` runs tests in watch mode (put examples for part 1 and part 2 in `day-xx/test.ts`)
1. Solve the puzzle 😊 in `day-xx/mod.ts`
1. `just solve day-xx part1` / `just solve day-xx part2` runs the solution using the input.
