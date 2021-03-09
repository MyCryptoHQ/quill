import { formatDistance } from 'date-fns';

export const formatTimeDifference = (a: number, b: number = Date.now()) =>
  formatDistance(a, b, { addSuffix: true, includeSeconds: true });
