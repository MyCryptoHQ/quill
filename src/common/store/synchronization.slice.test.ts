/**
 * @jest-environment node
 */

/* eslint-disable jest/expect-expect */

import { expectSaga } from 'redux-saga-test-plan';

import { setNewUser } from '@common/store';
import { createHandshakeKeyPair, encryptJson } from '@common/utils';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';

import slice, {
  createKeyPair,
  createKeyPairWorker,
  postHandshake,
  putJson,
  sendPublicKey,
  setHandshaken,
  setKeyPair,
  setPersisted,
  setPublicKeyWorker,
  setTargetPublicKey
} from './synchronization.slice';

describe('Handshake', () => {
  describe('setHandshaken', () => {
    it('sets isHandshaken to the payload', () => {
      expect(
        slice.reducer({ isHandshaken: false, isPersisted: false }, setHandshaken(true))
      ).toStrictEqual({
        isHandshaken: true,
        isPersisted: false
      });

      expect(
        slice.reducer({ isHandshaken: true, isPersisted: false }, setHandshaken(false))
      ).toStrictEqual({
        isHandshaken: false,
        isPersisted: false
      });
    });
  });

  describe('setPersisted', () => {
    it('sets isPersisted to the payload', () => {
      expect(
        slice.reducer({ isHandshaken: false, isPersisted: false }, setPersisted(true))
      ).toStrictEqual({
        isHandshaken: false,
        isPersisted: true
      });

      expect(
        slice.reducer({ isHandshaken: false, isPersisted: true }, setPersisted(false))
      ).toStrictEqual({
        isHandshaken: false,
        isPersisted: false
      });
    });
  });

  describe('setKeyPair', () => {
    it('sets publicKey and privateKey to the payload', async () => {
      const keyPair = await createHandshakeKeyPair();
      expect(
        slice.reducer({ isHandshaken: false, isPersisted: false }, setKeyPair(keyPair))
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
          { isHandshaken: false, isPersisted: false },
          setTargetPublicKey(fEncryptionPublicKey)
        )
      ).toStrictEqual(
        expect.objectContaining({
          targetPublicKey: fEncryptionPublicKey
        })
      );
    });
  });
});

describe('putJson', () => {
  it('puts an action if isDecrypted is set or if the action is handshake/sendPublicKey', async () => {
    const action = JSON.stringify(sendPublicKey(fEncryptionPublicKey));
    await expectSaga(putJson, action)
      .put({ ...sendPublicKey(fEncryptionPublicKey), remote: true })
      .silentRun();

    const insecureAction = JSON.stringify(setNewUser(true));
    await expectSaga(putJson, insecureAction, true)
      .put({ ...setNewUser(true), remote: true })
      .silentRun();
  });

  it('decrypts an encrypted action', async () => {
    const insecureAction = JSON.stringify(setNewUser(true));
    const encryptedAction = encryptJson(fEncryptionPublicKey, insecureAction);

    await expectSaga(putJson, JSON.stringify({ data: encryptedAction }), true)
      .withState({ synchronization: { isHandshaken: true, privateKey: fEncryptionPrivateKey } })
      .put({ ...setNewUser(true), remote: true })
      .silentRun();
  });

  it('does nothing on invalid JSON', async () => {
    await expectSaga(putJson, 'foo bar').silentRun();
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
    const action = { ...sendPublicKey(fEncryptionPublicKey), remote: true };
    await expectSaga(setPublicKeyWorker, action)
      .withState({ synchronization: { isHandshaken: false, publicKey: fEncryptionPublicKey } })
      .put(setTargetPublicKey(fEncryptionPublicKey))
      .put(setHandshaken(true))
      .put(sendPublicKey(fEncryptionPublicKey))
      .put(postHandshake())
      .silentRun();

    await expectSaga(setPublicKeyWorker, action)
      .withState({ synchronization: { isHandshaken: true, publicKey: fEncryptionPublicKey } })
      .put(setTargetPublicKey(fEncryptionPublicKey))
      .silentRun();
  });

  it('does nothing if the action is not remote', async () => {
    const action = { ...sendPublicKey(fEncryptionPublicKey), remote: false };
    await expectSaga(setPublicKeyWorker, action).silentRun();
  });
});
