import { sum } from "@es-toolkit/es-toolkit";

async function parse(
  input: ReadableStream<string>,
): Promise<[Map<number, Set<number>>, number[][]]> {
  const lines = await Array.fromAsync(input);
  const empty = lines.indexOf("");

  const deps = new Map<number, Set<number>>();
  lines.slice(0, empty)
    .map((line) => line.split("|"))
    .map((pair) => pair.map(Number))
    .forEach(([a, b]) => {
      if (deps.has(a)) deps.get(a)?.add(b);
      else deps.set(a, new Set([b]));
    });

  const reports = lines.slice(empty + 1)
    .map((line) => line.split(","))
    .map((parts) => parts.map(Number));

  return [deps, reports];
}

const isValid = (deps: Map<number, Set<number>>) =>
  function (report: number[]): boolean {
    const printed = new Set();
    for (const a of report) {
      if (printed.intersection(deps.get(a) ?? new Set()).size > 0) {
        return false;
      }
      printed.add(a);
    }
    return true;
  };

export async function part1(input: ReadableStream<string>) {
  const [deps, reports] = await parse(input);
  return sum(
    reports
      .filter(isValid(deps))
      .map((report) => report[Math.floor(report.length / 2)]),
  );
}

export async function part2(input: ReadableStream<string>) {
  const [deps, reports] = await parse(input);
  const depsOf = (a: number) => deps.get(a) ?? new Set();

  return sum(
    reports
      .filter((report) => !isValid(deps)(report))
      .map((report) => {
        report.sort((a, b) => {
          if (depsOf(a).has(b)) return -1;
          if (depsOf(b).has(a)) return 1;
          return 0;
        });
        return report;
      })
      .map((report) => report[Math.floor(report.length / 2)]),
  );
}
