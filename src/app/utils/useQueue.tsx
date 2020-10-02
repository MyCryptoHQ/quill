import { useDispatch, useSelector } from 'react-redux';

import { ApplicationState } from '@app/store/store';
import { dequeue, enqueue } from '@app/store/txqueue/txqueue';
import { JsonRPCRequest } from '@types';

export const useQueue = (
  selector: (state: ApplicationState) => JsonRPCRequest[]
): {
  first: JsonRPCRequest;
  length: number;
  enqueue(obj: JsonRPCRequest): void;
  dequeue(): void;
} => {
  const queue = useSelector(selector);
  const dispatch = useDispatch();

  return {
    first: queue[0],
    length: queue.length,
    enqueue: (obj: JsonRPCRequest) => dispatch(enqueue(obj)),
    dequeue: () => dispatch(dequeue())
  };
};
