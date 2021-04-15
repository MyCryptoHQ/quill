import { createAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from 'electron';
import { AnyAction } from 'redux';
import { eventChannel, SagaIterator } from 'redux-saga';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import {
  createHandshakeKeyPair,
  decryptJson,
  isEncryptedAction,
  isReduxAction
} from '@common/utils';
import { HandshakeKeyPair, ReduxIPC } from '@types';
import { safeJSONParse } from '@utils';

interface SynchronisationState {
  publicKey?: string;
  privateKey?: string;

  isHandshaken: boolean;

  targetPublicKey?: string;
}

const initialState: SynchronisationState = {
  isHandshaken: false
};

const sliceName = 'synchronisation';

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
  setTargetPublicKey
} = slice.actions;

export default slice;

export const getSynchronisationState = createSelector(
  (state: { synchronisation: SynchronisationState }) => state,
  (state) => state.synchronisation
);

export const getPublicKey = createSelector(getSynchronisationState, (state) => state.publicKey);
export const getPrivateKey = createSelector(getSynchronisationState, (state) => state.privateKey);
export const getHandshaken = createSelector(getSynchronisationState, (state) => state.isHandshaken);

export const getTargetPublicKey = createSelector(
  getSynchronisationState,
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
