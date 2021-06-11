import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import type { Event } from 'electron';
import type { AnyAction } from 'redux';
import type { SagaIterator } from 'redux-saga';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import type { HandshakeKeyPair, ReduxIPC } from '../types';
import {
  createHandshakeKeyPair,
  decryptJson,
  isEncryptedAction,
  isReduxAction,
  keys,
  safeJSONParse
} from '../utils';

export enum Process {
  Renderer = 'Renderer',
  Main = 'Main',
  Crypto = 'Crypto'
}

export interface SynchronizationState {
  publicKey?: string;
  privateKey?: string;

  isHandshaken: Partial<Record<Process, boolean>>;

  targetPublicKey: Partial<Record<Process, string>>;
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
    setHandshaken(state, action: PayloadAction<{ target: Process; isHandshaken: boolean }>) {
      state.isHandshaken[action.payload.target] = action.payload.isHandshaken;
    },
    setKeyPair(state, action: PayloadAction<HandshakeKeyPair>) {
      state.publicKey = action.payload.publicKey;
      state.privateKey = action.payload.privateKey;
    },
    setTargetPublicKey(state, action: PayloadAction<{ target: Process; publicKey: string }>) {
      state.targetPublicKey[action.payload.target] = action.payload.publicKey;
    }
  }
});

export const createKeyPair = createAction<boolean | undefined>(`${sliceName}/createKeyPair`);
export const sendPublicKey = createAction<string>(`${sliceName}/sendPublicKey`);

export const { setKeyPair, setHandshaken, setTargetPublicKey } = slice.actions;

export default slice;

export const getSynchronizationState = createSelector(
  (state: { synchronization: SynchronizationState }) => state,
  (state) => state.synchronization
);

export const getPublicKey = createSelector(getSynchronizationState, (state) => state.publicKey);
export const getPrivateKey = createSelector(getSynchronizationState, (state) => state.privateKey);
export const getHandshaken = (target: Process) =>
  createSelector(getSynchronizationState, (state) => state.isHandshaken[target]);

export const getTargetPublicKey = (target: Process) =>
  createSelector(getSynchronizationState, (state) => state.targetPublicKey[target]);

export const postHandshake = createAction(`${sliceName}/postHandshake`);

export function* handshakeSaga(processes: Partial<Record<Process, ReduxIPC>>, self: Process) {
  yield all([
    ...keys(processes).map((target) => ipcWorker(processes, target, self)),
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

export function* putJson(
  self: Process,
  processes: Partial<Record<Process, ReduxIPC>>,
  json: string,
  isDecrypted: boolean = false
): SagaIterator {
  const [error, action] = safeJSONParse<AnyAction & { to?: Process; from?: Process }>(json);
  if (error) {
    return;
  }

  if (isReduxAction(action) && (isDecrypted || action.type === sendPublicKey.type)) {
    yield put({ ...action, remote: true });
    return;
  }

  const from = action.from;
  const to = action.to;

  if (to && self !== to && to in processes) {
    processes[to].emit(json);
    return;
  }

  const isHandshaken = yield select(getHandshaken(from));
  if (isHandshaken && isEncryptedAction(action)) {
    const privateKey: string = yield select(getPrivateKey);
    const json = decryptJson(privateKey, action);

    yield call(putJson, self, processes, json, true);
  }
}

export function* ipcWorker(
  processes: Partial<Record<Process, ReduxIPC>>,
  target: Process,
  self: Process
): SagaIterator {
  const channel = yield call(subscribe, processes[target]);
  while (true) {
    const request: string = yield take(channel);
    yield call(putJson, self, processes, request);
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
  action: PayloadAction<string> & { remote: boolean; from?: Process }
) {
  if (action.remote) {
    const target = action.from;
    yield put(setTargetPublicKey({ target, publicKey: action.payload }));

    const isHandshaken: boolean = yield select(getHandshaken(target));
    const publicKey: string = yield select(getPublicKey);

    if (!isHandshaken) {
      yield put(setHandshaken({ target: action.from, isHandshaken: true }));
      yield put(sendPublicKey(publicKey));
      yield put(postHandshake());
    }
  }
}
