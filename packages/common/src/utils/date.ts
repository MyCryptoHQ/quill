import { formatDistanceStrict } from 'date-fns';

export const formatTimeDifference = (a: number, b: number = Date.now()) =>
  formatDistanceStrict(a, b, { addSuffix: true });

const replacements = {
  second: 's',
  minute: 'm',
  hour: 'h',
  day: 'd',
  week: 'w',
  month: 'mo',
  year: 'y'
};

export const formatTimeDifferenceShort = (a: number, b: number = Date.now()) =>
  Object.entries(replacements).reduce(
    (acc, [key, value]) => acc.replace(` ${key}s`, value).replace(` ${key}`, value),
    formatTimeDifference(a, b)
  );
