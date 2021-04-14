/**
 * @jest-environment node
 */

/* eslint-disable jest/expect-expect */

import { encrypt } from 'eciesjs';
import { expectSaga } from 'redux-saga-test-plan';

import { createHandshakeKeyPair } from '@common/utils';
import { fEncryptionPrivateKey, fEncryptionPublicKey } from '@fixtures';

import slice, {
  createKeyPair,
  createKeyPairWorker,
  postHandshake,
  putJson,
  sendPublicKey,
  setHandshaken,
  setKeyPair,
  setPublicKeyWorker,
  setTargetPublicKey
} from './handshake';

describe('Handshake', () => {
  describe('setHandshaken', () => {
    it('sets isHandshaken to the payload', () => {
      expect(slice.reducer({ isHandshaken: false }, setHandshaken(true))).toStrictEqual({
        isHandshaken: true
      });

      expect(slice.reducer({ isHandshaken: true }, setHandshaken(false))).toStrictEqual({
        isHandshaken: false
      });
    });
  });

  describe('setKeyPair', () => {
    it('sets publicKey and privateKey to the payload', async () => {
      const keyPair = await createHandshakeKeyPair();
      expect(slice.reducer({ isHandshaken: false }, setKeyPair(keyPair))).toStrictEqual(
        expect.objectContaining({
          ...keyPair
        })
      );
    });
  });

  describe('setTargetPublicKey', () => {
    it('sets targetPublicKey to the payload', () => {
      expect(
        slice.reducer({ isHandshaken: false }, setTargetPublicKey(fEncryptionPublicKey))
      ).toStrictEqual(
        expect.objectContaining({
          targetPublicKey: fEncryptionPublicKey
        })
      );
    });
  });
});

describe('putJson', () => {
  it('puts an action if allowInsecure is set or if the action is handshake/sendPublicKey', async () => {
    const action = JSON.stringify(sendPublicKey(fEncryptionPublicKey));
    await expectSaga(putJson, action)
      .put({ ...sendPublicKey(fEncryptionPublicKey), remote: true })
      .silentRun();

    const insecureAction = JSON.stringify(setHandshaken(true));
    await expectSaga(putJson, insecureAction, true)
      .put({ ...setHandshaken(true), remote: true })
      .silentRun();
  });

  it('decrypts an encrypted action', async () => {
    const insecureAction = JSON.stringify(setHandshaken(true));
    const encryptedAction = encrypt(
      fEncryptionPublicKey,
      Buffer.from(insecureAction, 'utf-8')
    ).toString('hex');
    await expectSaga(putJson, JSON.stringify({ data: encryptedAction }), true)
      .withState({ handshake: { isHandshaken: true, privateKey: fEncryptionPrivateKey } })
      .put({ ...setHandshaken(true), remote: true })
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
      .withState({ handshake: { isHandshaken: false, publicKey: fEncryptionPublicKey } })
      .put(setTargetPublicKey(fEncryptionPublicKey))
      .put(setHandshaken(true))
      .put(sendPublicKey(fEncryptionPublicKey))
      .put(postHandshake())
      .silentRun();

    await expectSaga(setPublicKeyWorker, action)
      .withState({ handshake: { isHandshaken: true, publicKey: fEncryptionPublicKey } })
      .put(setTargetPublicKey(fEncryptionPublicKey))
      .silentRun();
  });

  it('does nothing if the action is not remote', async () => {
    const action = { ...sendPublicKey(fEncryptionPublicKey), remote: false };
    await expectSaga(setPublicKeyWorker, action).silentRun();
  });
});
