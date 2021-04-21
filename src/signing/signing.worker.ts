import { createKeyPair } from '@common/store';

import { createStore } from './store';

const store = createStore({
  emit: (msg) => { 
    console.log("SIGNING EMITTING", msg)
    process.send(msg) },
  on: (listener: any) => {
    process.on('message', (msg) => listener(undefined, msg));
    process.on('message', (msg) => console.log('SIGNING RECEIVED', msg));
    return () => {
      //process.removeListener('message', listener);
    };
  },
  handle: () => undefined
});
console.log('SIGNING PROCESS CREATING KEYPAIR');
store.dispatch(createKeyPair());