import { useState } from 'react';

export const useQueue = <T,>() => {
  const [queue, setQueue] = useState<T[]>([]);

  const first = queue[0];
  const { length } = queue;
  const enqueue = (item: T) => setQueue((prevState) => [...prevState, item]);
  const dequeue = () => setQueue(([, ...rest]) => [...rest]);

  return { first, length, enqueue, dequeue };
};
