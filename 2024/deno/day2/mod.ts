async function parse(input: ReadableStream<string>) {
  return (await Array.fromAsync(input)).map((line) =>
    line.split(/\s+/).map(Number)
  );
}

function isSafe(report: number[]) {
  let safe = true;
  let up = false, down = false;
  let prev = report[0];
  for (const cur of report.slice(1)) {
    const diff = cur - prev;
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      safe = false;
      break;
    }
    if (diff > 0) up = true;
    if (diff < 0) down = true;
    prev = cur;
  }
  safe &&= up && !down || down && !up;
  return safe;
}

export async function part1(input: ReadableStream<string>) {
  return (await parse(input)).filter(isSafe).length;
}

function getVariations(a: number[]): Array<number[]> {
  return [a].concat(
    a.map((_, i) => a.slice(0, i).concat(a.slice(i + 1))),
  );
}

export async function part2(input: ReadableStream<string>) {
  return (await parse(input))
    .filter((report) => getVariations(report).some(isSafe))
    .length;
}
