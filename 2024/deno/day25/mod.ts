async function parse(input: ReadableStream<string>) {
  let type: "unknown" | "lock" | "key" = "unknown";
  let prev;
  let n = 0;
  let diffs: number[] = [];

  const locks: number[][] = [];
  const keys: number[][] = [];

  const push = () => {
    if (type === "lock") locks.push(diffs);
    else keys.push(diffs.map((x) => n - 1 - x));
  };

  for await (const line of input) {
    if (!line) {
      push();
      type = "unknown";
    } else if (type === "unknown") {
      type = line.startsWith("#") ? "lock" : "key";
      diffs = [];
      n = 0;
    } else {
      for (let i = 0; i < line.length; i++) {
        if (line[i] !== prev![i]) diffs[i] = n;
      }
      n++;
    }
    prev = line;
  }
  push();

  return { locks, keys, height: n - 1 };
}

export async function part1(input: ReadableStream<string>) {
  const { keys, locks, height } = await parse(input);

  const match = (lock: number[], key: number[]) => {
    for (let i = 0; i < lock.length; i++) {
      if (lock[i] + key[i] > height) return false;
    }
    return true;
  };

  let answer = 0;
  for (const key of keys) {
    for (const lock of locks) {
      if (match(key, lock)) answer++;
    }
  }
  return answer;
}

export async function part2(input: ReadableStream<string>) {
  const _ = await parse(input);
}
