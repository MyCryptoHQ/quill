import { act, renderHook } from '@testing-library/react-hooks';
import { Persistor, PersistorSubscribeCallback } from 'redux-persist';
import { PersistorState } from 'redux-persist/es/types';

import { usePersisted } from './usePersisted';

describe('usePersisted', () => {
  it('checks if the store was persisted', () => {
    const unsubscribe = jest.fn();
    let callbackFn: () => void;

    // @ts-expect-error Persistor is only partially implemented
    const persistor: Persistor = {
      getState(): PersistorState {
        return {
          registry: [],
          bootstrapped: true
        };
      },

      subscribe(callback: PersistorSubscribeCallback): () => void {
        callbackFn = callback;
        return unsubscribe;
      }
    };

    const { result, unmount } = renderHook(() => usePersisted(persistor));

    expect(callbackFn).toBeDefined();
    expect(result.current).toBe(false);

    act(() => callbackFn());

    expect(result.current).toBe(true);

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
