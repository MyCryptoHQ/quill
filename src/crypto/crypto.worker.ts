import { createKeyPair } from '@common/store';

import { createStore } from './store';

export const init = () => {
  const store = createStore({
    emit: (msg) => process.send(msg),
    on: (listener: (event: undefined, ...args: unknown[]) => void) => {
      process.on('message', (msg) => listener(undefined, msg));
      return () => {
        (process as NodeJS.EventEmitter).removeListener('message', listener);
      };
    }
  });
  store.dispatch(createKeyPair());
};

init();
