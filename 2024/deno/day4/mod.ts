async function parse(
  input: ReadableStream<string>,
): Promise<[string[], number, number]> {
  const a = await Array.fromAsync(input);
  return [a, a.length, a[0].length];
}

export async function part1(input: ReadableStream<string>) {
  const [a, n, m] = await parse(input);

  const pattern = [..."XMAS"];

  let matches = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di !== 0 || dj !== 0) {
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < m; j++) {
            if (
              pattern.every((char, k) =>
                char === (a[i + k * di] ?? [])[j + k * dj]
              )
            ) matches++;
          }
        }
      }
    }
  }
  return matches;
}

export async function part2(input: ReadableStream<string>) {
  const [a, n, m] = await parse(input);

  let matches = 0;
  for (let i = 1; i < n - 1; i++) {
    for (let j = 1; j < m - 1; j++) {
      if (a[i][j] === "A") {
        const d1 = a[i - 1][j - 1] + a[i + 1][j + 1];
        const d2 = a[i + 1][j - 1] + a[i - 1][j + 1];
        if ((d1 === "MS" || d1 === "SM") && (d2 === "MS" || d2 === "SM")) {
          matches++;
        }
      }
    }
  }
  return matches;
}
