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

interface SynchronizationState {
  publicKey?: string;
  privateKey?: string;

  isHandshaken: boolean;
  // Is true if persistence is set up and synced with main process
  isPersisted: boolean;

  targetPublicKey?: string;
}

const initialState: SynchronizationState = {
  isHandshaken: false,
  isPersisted: false
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
    setHandshaken(state, action: PayloadAction<boolean>) {
      state.isHandshaken = action.payload;
    },
    setPersisted(state, action: PayloadAction<boolean>) {
      state.isPersisted = action.payload;
    },
    setKeyPair(state, action: PayloadAction<HandshakeKeyPair>) {
      state.publicKey = action.payload.publicKey;
      state.privateKey = action.payload.privateKey;
    },
    setTargetPublicKey(state, action: PayloadAction<string>) {
      state.targetPublicKey = action.payload;
    }
  }
});

export const {
  createKeyPair,
  setKeyPair,
  sendPublicKey,
  setHandshaken,
  setPersisted,
  setTargetPublicKey
} = slice.actions;

export default slice;

export const getSynchronizationState = createSelector(
  (state: { synchronization: SynchronizationState }) => state,
  (state) => state.synchronization
);

export const getPublicKey = createSelector(getSynchronizationState, (state) => state.publicKey);
export const getPrivateKey = createSelector(getSynchronizationState, (state) => state.privateKey);
export const getHandshaken = createSelector(getSynchronizationState, (state) => state.isHandshaken);
export const getPersisted = createSelector(getSynchronizationState, (state) => state.isPersisted);

export const getTargetPublicKey = createSelector(
  getSynchronizationState,
  (state) => state.targetPublicKey
);

export const postHandshake = createAction(`${sliceName}/postHandshake`);

export function* handshakeSaga(ipc: ReduxIPC) {
  yield all([
    ipcWorker(ipc),
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

  if (isReduxAction(action) && (isDecrypted || action.type === sendPublicKey.type)) {
    yield put({ ...action, remote: true });
    return;
  }

  const isHandshaken = yield select(getHandshaken);
  if (isHandshaken && isEncryptedAction(action)) {
    const privateKey: string = yield select(getPrivateKey);
    const json = decryptJson(privateKey, action);

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

export function* setPublicKeyWorker(action: PayloadAction<string> & { remote: boolean }) {
  if (action.remote) {
    yield put(setTargetPublicKey(action.payload));

    const isHandshaken: boolean = yield select(getHandshaken);
    const publicKey: string = yield select(getPublicKey);

    if (!isHandshaken) {
      yield put(setHandshaken(true));
      yield put(sendPublicKey(publicKey));
      yield put(postHandshake());
    }
  }
}
