import { DependencyList, useEffect, useRef } from 'react';

// From https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export function useInterval(
  callback: () => void,
  delay: number,
  immediate?: boolean,
  trigger?: DependencyList
) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, []);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    // Trigger the interval immediately
    if (immediate) {
      tick();
    }

    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay, ...(trigger ?? [])]);
}
