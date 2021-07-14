/**
 * @jest-environment node
 */

import {
  fEncryptionPrivateKey,
  fEncryptionPublicKey,
  fPrivateKey,
  fTxRequest
} from '../__fixtures__';
import { Process } from '../store';
import {
  decryptJson,
  encryptJson,
  isEncryptedAction,
  isReduxAction,
  signJsonRpcRequest
} from './synchronization';

describe('isReduxAction', () => {
  it('checks if an object is a Redux action', () => {
    expect(isReduxAction({ type: 'foo', payload: 'bar' })).toBe(true);

    expect(isReduxAction({})).toBe(false);
    expect(isReduxAction({ foo: 'bar' })).toBe(false);
    expect(isReduxAction('foo')).toBe(false);
  });
});

describe('isEncryptedAction', () => {
  it('checks if an object is an encrypted action', () => {
    expect(isEncryptedAction({ data: 'foo', from: Process.Main })).toBe(true);

    expect(isEncryptedAction({})).toBe(false);
    expect(isEncryptedAction({ foo: 'bar' })).toBe(false);
    expect(isEncryptedAction('foo')).toBe(false);
  });
});

describe('encryptJson', () => {
  it('encrypts a JSON string with a public key', () => {
    const json = JSON.stringify({ foo: 'bar' });
    const action = { data: encryptJson(fEncryptionPublicKey, json) };

    expect(decryptJson(fEncryptionPrivateKey, action)).toBe(json);
  });
});

describe('decryptJson', () => {
  it('decrypts encrypted JSON', () => {
    const json = JSON.stringify({ foo: 'bar' });
    const action = {
      data:
        '0x041abf5a1033e116c6fca36ef25e4ecb21f4ac9b487c88d4a9360d73825b0b385e06bd2e499479967668a19bb372eef6b67294385e2a585e2092ccaaf45eb3a531281a35eaa1100063dd0cf7b9c85d875bb0deca201303e5f97b043c9716988049836fe19a72cfbaea56c08a4d30'
    };

    expect(decryptJson(fEncryptionPrivateKey, action)).toBe(json);
  });
});

describe('signJsonRpcRequest', () => {
  it('signs a JSON-RPC request', async () => {
    await expect(signJsonRpcRequest(fPrivateKey, fTxRequest)).resolves.toStrictEqual({
      ...fTxRequest,
      publicKey: '7ffb25fc9c2621ca02bfafa545e7fdbfb4839d70c1d3dda52587b7beb001eb14',
      signature:
        'bd6ad2eb20423f24de9b6ab2607ab0e08a544128c9f2cb41c93d52a08fea862e487210428efca7ae94cafd41afd5f6ee55540e5774dc13135761fd8278cc2302'
    });
  });
});
