import { toText } from "jsr:@std/streams";
import { sum } from "jsr:@es-toolkit/es-toolkit";

type State = { i: number; input: string };

const parseString = (str: string) => (state: State): boolean => {
  if (state.input.slice(state.i).startsWith(str)) {
    state.i += str.length;
    return true;
  } else return false;
};

const parseMul = parseString("mul(");
const parseComma = parseString(",");
const parseParen = parseString(")");

const parseDo = parseString("do()");
const parseDont = parseString("don't()");

const parseNumber =
  (into: (val: number) => void) => (state: State): boolean => {
    const a = parseInt(state.input.slice(state.i), 10);
    if (!isNaN(a) && a.toString().length <= 3) {
      into(a);
      state.i += a.toString().length;
      return true;
    } else return false;
  };

type Instruction =
  | { type: "mul"; a: number; b: number }
  | { type: "enable" }
  | { type: "disable" };

async function parse(input: ReadableStream<string>) {
  return await Array.fromAsync(
    (function* (state: State): Generator<Instruction> {
      let a = 0, b = 0;
      while (state.i < state.input.length) {
        if (
          parseMul(state) &&
          parseNumber((x) => a = x)(state) &&
          parseComma(state) &&
          parseNumber((x) => b = x)(state) &&
          parseParen(state)
        ) yield { type: "mul", a, b };
        else if (parseDont(state)) yield { type: "disable" };
        else if (parseDo(state)) yield { type: "enable" };
        else state.i++;
      }
    })(
      { input: await toText(input), i: 0 },
    ),
  );
}

export async function part1(input: ReadableStream<string>) {
  return sum(
    (await parse(input))
      .filter((i) => i.type === "mul")
      .map(({ a, b }) => a * b),
  );
}

export async function part2(input: ReadableStream<string>) {
  // return (await parse(input))
  //   .reduce((state, i) => {
  //     if (i.type === "mul") {
  //       return {
  //         ...state,
  //         sum: state.enabled ? state.sum + i.a * i.b : state.sum,
  //       };
  //     } else if (i.type === "enable") return { ...state, enabled: true };
  //     else if (i.type === "disable") return { ...state, enabled: false };
  //     else return state;
  //   }, { enabled: true, sum: 0 }).sum;

  let sum = 0, enabled = true;
  for (const i of await parse(input)) {
    if (i.type === "mul") { if (enabled) sum += i.a * i.b; }
    else if (i.type === "enable") enabled = true;
    else if (i.type === "disable") enabled = false;
  }
  return sum;
}
