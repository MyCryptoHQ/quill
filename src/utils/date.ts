import { formatDistanceStrict } from 'date-fns';

export const formatTimeDifference = (a: number, b: number = Date.now()) =>
  formatDistanceStrict(a, b, { addSuffix: true });
