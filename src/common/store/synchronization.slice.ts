import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import type { Event } from 'electron';
import type { AnyAction } from 'redux';
import type { SagaIterator } from 'redux-saga';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  createHandshakeKeyPair,
  decryptJson,
  isEncryptedAction,
  isReduxAction
} from '@common/utils';
import type { HandshakeKeyPair, ReduxIPC } from '@types';
import { safeJSONParse } from '@utils';

export enum SynchronizationTarget {
  RENDERER = 'RENDERER',
  MAIN = 'MAIN',
  SIGNING = 'SIGNING'
}

interface SynchronizationState {
  publicKey?: string;
  privateKey?: string;

  isHandshaken: Partial<Record<SynchronizationTarget, boolean>>;

  targetPublicKey: Partial<Record<SynchronizationTarget, string>>;
}

const initialState: SynchronizationState = {
  isHandshaken: {},
  targetPublicKey: {}
};

const sliceName = 'synchronization';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    createKeyPair(_, __: PayloadAction<boolean | undefined>) {
      // noop
    },
    sendPublicKey(_, __: PayloadAction<string>) {
      // noop
    },
    setHandshaken(
      state,
      action: PayloadAction<{ target: SynchronizationTarget; isHandshaken: boolean }>
    ) {
      state.isHandshaken[action.payload.target] = action.payload.isHandshaken;
    },
    setKeyPair(state, action: PayloadAction<HandshakeKeyPair>) {
      state.publicKey = action.payload.publicKey;
      state.privateKey = action.payload.privateKey;
    },
    setTargetPublicKey(
      state,
      action: PayloadAction<{ target: SynchronizationTarget; publicKey: string }>
    ) {
      state.targetPublicKey[action.payload.target] = action.payload.publicKey;
    }
  }
});

export const {
  createKeyPair,
  setKeyPair,
  sendPublicKey,
  setHandshaken,
  setTargetPublicKey
} = slice.actions;

export default slice;

export const getSynchronizationState = createSelector(
  (state: { synchronization: SynchronizationState }) => state,
  (state) => state.synchronization
);

export const getPublicKey = createSelector(getSynchronizationState, (state) => state.publicKey);
export const getPrivateKey = createSelector(getSynchronizationState, (state) => state.privateKey);
export const getHandshaken = (target: SynchronizationTarget) =>
  createSelector(getSynchronizationState, (state) => state.isHandshaken[target]);

export const getTargetPublicKey = (target: SynchronizationTarget) =>
  createSelector(getSynchronizationState, (state) => state.targetPublicKey[target]);

export const postHandshake = createAction(`${sliceName}/postHandshake`);

export function* handshakeSaga(ipcs: Partial<Record<SynchronizationTarget, ReduxIPC>>) {
  yield all([
    ...Object.values(ipcs).map(ipc => ipcWorker(ipc)),
    takeLatest(createKeyPair.type, createKeyPairWorker),
    takeEvery(sendPublicKey.type, setPublicKeyWorker)
  ]);
}

export const subscribe = (ipc: ReduxIPC) => {
  return eventChannel((emitter) => {
    const unsubscribe = ipc.on((_: Event, action: string) => {
      emitter(action);
    });

    return () => {
      unsubscribe();
    };
  });
};

export function* putJson(json: string, isDecrypted: boolean = false): SagaIterator {
  const [error, action] = safeJSONParse<AnyAction>(json);
  if (error) {
    return;
  }

  console.log('Received', action);

  if (isReduxAction(action) && (isDecrypted || action.type === sendPublicKey.type)) {
    yield put({ ...action, remote: true });
    return;
  }

  const from = action.from;

  const isHandshaken = yield select(getHandshaken(from));
  if (isHandshaken && isEncryptedAction(action)) {
    const privateKey: string = yield select(getPrivateKey);
    const json = decryptJson(privateKey, action);

    console.log('Decrypted Received', json);

    yield call(putJson, json, true);
  }
}

export function* ipcWorker(ipc: ReduxIPC) {
  const channel = yield call(subscribe, ipc);
  while (true) {
    const request: string = yield take(channel);
    yield call(putJson, request);
  }
}

export function* createKeyPairWorker({ payload = false }: PayloadAction<boolean>) {
  const keyPair: HandshakeKeyPair = yield call(createHandshakeKeyPair);
  yield put(setKeyPair(keyPair));

  if (payload) {
    yield put(sendPublicKey(keyPair.publicKey));
  }
}

export function* setPublicKeyWorker(
  action: PayloadAction<string> & { remote: boolean; from: SynchronizationTarget }
) {
  if (action.remote) {
    const target = action.from;
    yield put(setTargetPublicKey({ target, publicKey: action.payload }));

    const isHandshaken: boolean = yield select(getHandshaken(target));
    const publicKey: string = yield select(getPublicKey);

    const handshakes = yield select((state) => state.synchronization.isHandshaken);

    console.log('Handshakes', handshakes);
    if (!isHandshaken) {
      yield put(setHandshaken({ target: action.from, isHandshaken: true }));
      yield put(sendPublicKey(publicKey));
      yield put(postHandshake());
    }
  }
}
