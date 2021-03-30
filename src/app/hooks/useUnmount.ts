import { useEffect } from 'react';

export const useUnmount = (fn: () => void): void => {
  useEffect(() => fn, []);
};
