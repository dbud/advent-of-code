import { toText } from "jsr:@std/streams/to-text";
import {
  flatMap,
  partition,
  range,
  sortBy,
  sum,
} from "jsr:@es-toolkit/es-toolkit";
import { Option } from "jsr:@seacrest/option-result-rs";

type Span = {
  pos: number;
  width: number;
  id?: number;
};

async function parse(input: ReadableStream<string>) {
  const { spans } = [...await toText(input)].map(Number)
    .reduce(({ pos, spans }, width, index) => {
      return {
        spans: spans.concat([
          index % 2 === 0 ? { width, pos, id: index / 2 } : { width, pos },
        ]),
        pos: pos + width,
      };
    }, { pos: 0, spans: [] as Span[] });
  const [blocks, gaps] = partition(spans, ({ id }) => id != null);
  return { blocks, gaps: new Gaps(gaps) };
}

class Gaps {
  #spans: Span[];

  constructor(spans: Span[]) {
    this.#spans = spans;
  }

  get leftmost() {
    return this.#spans[0]?.pos ?? Infinity;
  }

  get front() {
    return this.#spans[0];
  }

  fill(gap: Span, block: Span) {
    const idx = this.#spans.findIndex((g) => g === gap);
    if (block.width >= gap.width) {
      this.#spans.splice(idx, 1);
      const moved = { ...block, pos: gap.pos, width: gap.width };
      return { moved, left: block.width - gap.width };
    } else {
      const moved = { ...block, pos: gap.pos };
      gap.pos += block.width;
      gap.width -= block.width;
      return { moved, left: 0 };
    }
  }

  tryFill(
    block: Span,
    minWidth?: number,
  ): Option<{ left: number; moved: Span }> {
    const idx = this.#spans.findIndex((gap) =>
      gap.width >= (minWidth ?? block.width)
    );
    const gap = this.#spans[idx];
    if (idx === -1 || gap.pos >= block.pos) return Option.None();
    if (block.width >= gap.width) {
      this.#spans.splice(idx, 1);
      const moved = { ...block, pos: gap.pos, width: gap.width };
      return Option.Some({ moved, left: block.width - gap.width });
    } else {
      const moved = { ...block, pos: gap.pos };
      gap.pos += block.width;
      gap.width -= block.width;
      return Option.Some({ moved, left: 0 });
    }
  }

  get spans() {
    return this.#spans;
  }
}

function checksum(blocks: Span[]): number {
  return sum(flatMap(
    blocks,
    (block) =>
      range(block.pos, block.pos + block.width)
        .map((p) => p * (block.id ?? 0)),
  ));
}

export async function part1(input: ReadableStream<string>) {
  const { blocks, gaps } = await parse(input);

  const movedBlocks: Span[] = [];
  while (blocks.length > 0) {
    const block = blocks.at(-1) as Span;
    const result = gaps.tryFill(block, 1);
    if (result.isNone()) break;
    result.map(({ left, moved }) => {
      movedBlocks.push(moved);
      if (left > 0) block.width = left;
      else blocks.pop();
    });
  }

  const combined = sortBy(blocks.concat(movedBlocks), [(s) => s.pos]);
  return checksum(combined);
}

export async function part2(input: ReadableStream<string>) {
  const { blocks, gaps } = await parse(input);

  const movedBlocks: Span[] = [];
  while (blocks.length > 0) {
    const block = blocks.at(-1) as Span;
    const result = gaps.tryFill(block);
    result.match({
      Some: ({ left, moved }) => {
        movedBlocks.push(moved);
        if (left > 0) block.width = left;
        else blocks.pop();
      },
      None: () => {
        movedBlocks.push(block);
        blocks.pop();
      },
    });
  }

  const combined = sortBy(blocks.concat(movedBlocks), [(s) => s.pos]);
  return checksum(combined);
}
