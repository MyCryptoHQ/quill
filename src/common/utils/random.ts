export const shuffle = <T>(array: T[]): T[] => {
  return array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const getRandomNumbers = (max: number, length: number) => {
  const array = new Array(max).fill(undefined).map((_, index) => index);
  return shuffle(array)
    .slice(0, length)
    .sort((a, b) => a - b);
};
