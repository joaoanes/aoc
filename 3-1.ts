import { readFile } from "fs/promises";

const entireSchematic = (await readFile("./3.input")).toString();

type Symbol = {
  x: number;
  y: number;
  value: string;
};

type Range = {
  value: string;
  start: number;
  end: number;
  y: number;
  symbols: Symbol[];
};

const getLineRanges: (
  rangeString: string,
  y: number,
  existingRanges?: Range[],
  currentIndex?: number,
) => Range[] = (rangeString, y, existingRanges = [], currentIndex = 0) => {
  //console.log({rangeString, existingRanges, currentIndex})

  const possibleMatch = rangeString.match(/(\d+)/);
  if (possibleMatch === null) return existingRanges;
  else {
    const matchLength = possibleMatch[0].length;
    const start = possibleMatch.index as number;
    const end = start + matchLength;
    const stringWithoutExtractedRange = rangeString.substr(end);
    return getLineRanges(stringWithoutExtractedRange, y, [
      ...existingRanges,
      {
        value: possibleMatch[0],
        start: currentIndex + start,
        end: currentIndex + end - 1,
        y,
        symbols: [],
      },
    ], currentIndex + end);
  }
};
const matrix = entireSchematic.split("\n").filter((i) => i);
const matrixAccess: (
  matrix: string[],
) => (x: number, y: number) => string | undefined = (matrix) => (x, y) => (
  matrix[y] ? matrix[y].charAt(x) : undefined
);

const getNearbyCharacters: (
  matrix: string[],
  x: number,
  y: number,
) => Symbol[] = (matrix, x, y) => {
  // a b c
  // d * f
  // g h i
  const m = matrixAccess(matrix);

  const coords = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];
  return coords.map(([x, y]) => (m(x, y) ? { x, y, value: m(x, y) } : null))
    .filter((i) => i !== null) as Symbol[];
};

const ranges = matrix.map((line, y) => getLineRanges(line, y)).reduce((
  acc,
  e,
) => [...acc, ...e]);

const uniqueBy: (stuff: any[], key: string) => any[] = (arr, key) => (
  Object.values(Object.fromEntries(arr.map((val) => [val[key], val])))
);

const isValidNumber = (number) => Number.isInteger(Number.parseInt(number));

const rangesWithCharacters = ranges.map((range) => {
  for (let currentX = range.start; currentX <= range.end; currentX++) {
    range.symbols = [
      ...range.symbols,
      ...getNearbyCharacters(matrix, currentX, range.y).filter((sym) =>
        sym.value !== "." && !isValidNumber(sym.value)
      ),
    ];
    range.symbols = uniqueBy(range.symbols, "x");
  }
  return range;
});

const filtered = rangesWithCharacters.filter((range) =>
  range.symbols.length > 0
);
const summed = filtered.reduce(
  (sum, range) => sum + Number.parseInt(range.value),
  0,
);
console.log({ filtered, summed });
