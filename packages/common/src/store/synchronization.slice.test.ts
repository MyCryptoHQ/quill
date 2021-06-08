/**
 * @jest-environment node
 */

/* eslint-disable jest/expect-expect */

import { expectSaga } from 'redux-saga-test-plan';

import { setNewUser } from '.';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '../__fixtures__';
import { createHandshakeKeyPair, encryptJson } from '../utils';
import slice, {
  createKeyPair,
  createKeyPairWorker,
  postHandshake,
  Process,
  putJson,
  sendPublicKey,
  setHandshaken,
  setKeyPair,
  setPublicKeyWorker,
  setTargetPublicKey
} from './synchronization.slice';

describe('Handshake', () => {
  describe('setHandshaken', () => {
    it('sets isHandshaken to the payload', () => {
      expect(
        slice.reducer(
          { isHandshaken: {}, targetPublicKey: {} },
          setHandshaken({ target: Process.Main, isHandshaken: true })
        )
      ).toStrictEqual(
        expect.objectContaining({
          isHandshaken: {
            [Process.Main]: true
          }
        })
      );

      expect(
        slice.reducer(
          {
            isHandshaken: {
              [Process.Main]: true
            },
            targetPublicKey: {}
          },
          setHandshaken({ target: Process.Main, isHandshaken: false })
        )
      ).toStrictEqual(
        expect.objectContaining({
          isHandshaken: {
            [Process.Main]: false
          }
        })
      );
    });
  });

  describe('setKeyPair', () => {
    it('sets publicKey and privateKey to the payload', async () => {
      const keyPair = await createHandshakeKeyPair();
      expect(
        slice.reducer({ isHandshaken: {}, targetPublicKey: {} }, setKeyPair(keyPair))
      ).toStrictEqual(
        expect.objectContaining({
          ...keyPair
        })
      );
    });
  });

  describe('setTargetPublicKey', () => {
    it('sets targetPublicKey to the payload', () => {
      expect(
        slice.reducer(
          { isHandshaken: {}, targetPublicKey: {} },
          setTargetPublicKey({
            target: Process.Main,
            publicKey: fEncryptionPublicKey
          })
        )
      ).toStrictEqual(
        expect.objectContaining({
          targetPublicKey: {
            [Process.Main]: fEncryptionPublicKey
          }
        })
      );
    });
  });
});

describe('putJson', () => {
  it('puts an action if isDecrypted is set or if the action is handshake/sendPublicKey', async () => {
    const action = JSON.stringify(sendPublicKey(fEncryptionPublicKey));
    await expectSaga(putJson, Process.Main, {}, action)
      .put({ ...sendPublicKey(fEncryptionPublicKey), remote: true })
      .silentRun();

    const insecureAction = JSON.stringify(setNewUser(true));
    await expectSaga(putJson, Process.Main, {}, insecureAction, true)
      .put({ ...setNewUser(true), remote: true })
      .silentRun();
  });

  it('decrypts an encrypted action', async () => {
    const insecureAction = JSON.stringify(setNewUser(true));
    const encryptedAction = encryptJson(fEncryptionPublicKey, insecureAction);

    await expectSaga(
      putJson,
      Process.Renderer,
      {},
      JSON.stringify({ data: encryptedAction, from: Process.Main }),
      true
    )
      .withState({
        synchronization: {
          isHandshaken: { [Process.Main]: true },
          privateKey: fEncryptionPrivateKey
        }
      })
      .put({ ...setNewUser(true), remote: true })
      .silentRun();
  });

  it('forwards encrypted action with another recipient', async () => {
    const insecureAction = JSON.stringify(setNewUser(true));
    const encryptedAction = encryptJson(fEncryptionPublicKey, insecureAction);

    const ipc = { [Process.Crypto]: { emit: jest.fn(), on: jest.fn() } };

    const json = JSON.stringify({
      data: encryptedAction,
      to: Process.Crypto,
      from: Process.Renderer
    });

    await expectSaga(putJson, Process.Main, ipc, json, true)
      .withState({
        synchronization: {
          isHandshaken: { [Process.Crypto]: true },
          privateKey: fEncryptionPrivateKey
        }
      })
      .silentRun();

    expect(ipc[Process.Crypto].emit).toHaveBeenCalledWith(json);
  });

  it('does nothing on invalid JSON', async () => {
    await expectSaga(putJson, Process.Main, {}, 'foo bar').silentRun();
  });
});

describe('createKeyPairWorker', () => {
  it('generates a keypair and dispatches setKeyPair', async () => {
    const keyPair = await createHandshakeKeyPair();

    await expectSaga(createKeyPairWorker, createKeyPair()).put(setKeyPair(keyPair)).silentRun();
  });

  it('sends the public key if the payload is true', async () => {
    const keyPair = await createHandshakeKeyPair();

    await expectSaga(createKeyPairWorker, createKeyPair(true))
      .put(setKeyPair(keyPair))
      .put(sendPublicKey(keyPair.publicKey))
      .silentRun();
  });
});

describe('setPublicKeyWorker', () => {
  it('dispatches setTargetPublicKey and performs the handshake', async () => {
    const action = {
      ...sendPublicKey(fEncryptionPublicKey),
      remote: true,
      from: Process.Main
    };
    await expectSaga(setPublicKeyWorker, action)
      .withState({ synchronization: { isHandshaken: false, publicKey: fEncryptionPublicKey } })
      .put(setTargetPublicKey({ target: Process.Main, publicKey: fEncryptionPublicKey }))
      .put(setHandshaken({ target: Process.Main, isHandshaken: true }))
      .put(sendPublicKey(fEncryptionPublicKey))
      .put(postHandshake())
      .silentRun();

    await expectSaga(setPublicKeyWorker, action)
      .withState({
        synchronization: {
          isHandshaken: { [Process.Main]: true },
          publicKey: { [Process.Main]: fEncryptionPublicKey }
        }
      })
      .put(setTargetPublicKey({ target: Process.Main, publicKey: fEncryptionPublicKey }))
      .silentRun();
  });

  it('does nothing if the action is not remote', async () => {
    const action = { ...sendPublicKey(fEncryptionPublicKey), remote: false };
    await expectSaga(setPublicKeyWorker, action).silentRun();
  });
});
