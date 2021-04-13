import { arrayify, hexlify } from '@ethersproject/bytes';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from 'electron';
import { AnyAction } from 'redux';
import { eventChannel } from 'redux-saga';
import { all, call, put, select, take, takeLatest } from 'redux-saga/effects';

import { createHandshakeKeyPair, isReduxAction } from '@common/utils';
import { HandshakeKeyPair, ReduxIPC } from '@types';
import { safeJSONParse } from '@utils';

interface HandshakeState {
  publicKey?: Uint8Array;
  privateKey?: Uint8Array;

  isHandshaken: boolean;

  targetPublicKey?: Uint8Array;
}

const initialState: HandshakeState = {
  isHandshaken: false
};

const sliceName = 'handshake';

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
    setTargetPublicKey(state, action: PayloadAction<Uint8Array>) {
      state.publicKey = action.payload;
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

export const getHandshakeState = createSelector(
  (state: { handshake: HandshakeState }) => state,
  (state) => state.handshake
);

export const getPublicKey = createSelector(getHandshakeState, (state) => state.publicKey);

export const getHandshaken = createSelector(getHandshakeState, (state) => state.isHandshaken);

export const getTargetPublicKey = createSelector(
  getHandshakeState,
  (state) => state?.targetPublicKey
);

export function* handshakeSaga(ipc: ReduxIPC) {
  yield all([
    ipcWorker(ipc),
    takeLatest(createKeyPair.type, createKeyPairWorker),
    takeLatest(sendPublicKey.type, setPublicKeyWorker)
  ]);
}

export const subscribe = (ipc: ReduxIPC) => {
  return eventChannel((emitter) => {
    const unsubcribe = ipc.on((_: Event, action: string) => {
      if (action) {
        emitter(action);
      }
    });

    return () => {
      unsubcribe();
    };
  });
};

export function* ipcWorker(ipc: ReduxIPC) {
  const channel = yield call(subscribe, ipc);
  while (true) {
    const request: string = yield take(channel);
    const [error, action] = safeJSONParse<AnyAction>(request);
    if (error || !isReduxAction(action)) {
      return;
    }

    yield put({ ...action, remote: true });
  }
}

export function* createKeyPairWorker({ payload = false }: PayloadAction<boolean>) {
  const keyPair: HandshakeKeyPair = yield call(createHandshakeKeyPair);
  yield put(setKeyPair(keyPair));

  if (payload) {
    yield put(sendPublicKey(hexlify(keyPair.publicKey)));
    yield put(setHandshaken(true));
  }
}

export function* setPublicKeyWorker(action: PayloadAction<string> & { remote: boolean }) {
  if (action.remote) {
    yield put(setTargetPublicKey(arrayify(action.payload)));

    const isHandshaken: boolean = yield select(getHandshaken);
    const publicKey: Uint8Array = yield select(getPublicKey);

    if (!isHandshaken) {
      yield put(sendPublicKey(hexlify(publicKey)));
      yield put(setHandshaken(true));
    }
  }
}
