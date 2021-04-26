import { createKeyPair } from '@common/store';

import { createStore } from './store';

export const init = () => {
  const store = createStore({
    emit: (msg) => {
      console.log('SIGNING EMITTING', msg);
      process.send(msg);
    },
    on: (listener: (event: undefined, ...args: unknown[]) => void) => {
      process.on('message', (msg) => listener(undefined, msg));
      process.on('message', (msg) => console.log('SIGNING RECEIVED', msg));
      return () => {
        (process as NodeJS.EventEmitter).removeListener('message', listener);
      };
    }
  });
  console.log('SIGNING PROCESS CREATING KEYPAIR');
  store.dispatch(createKeyPair());
};

init();
