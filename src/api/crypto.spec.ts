import { ipcMain } from 'electron';

import { IPC_CHANNELS } from '@config';
import { fMnemonicPhrase } from '@fixtures';
import { CryptoRequestType, WalletType } from '@types';

import { handleRequest, runService } from './crypto';

jest.mock('@ethersproject/wallet', () => ({
  Wallet: jest.fn().mockImplementation(() => ({
    address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
    signTransaction: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          '0xf86b1885012a05f200825208945197b5b062288bbf29008c92b08010a92dd677cd872386f26fc10000802aa0f59ba7d53009466f5acc79fc76a51818107c3ff3d8340ce91a1c99f272854104a01336d15b3ea9e66458d94d71a2a5bee498c176edb79e97c6ed12f2e47b74fac6'
        )
      )
  }))
}));

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest
    .fn()
    .mockImplementation(() => [
      223,
      155,
      243,
      126,
      111,
      205,
      249,
      191,
      55,
      230,
      252,
      223,
      155,
      243,
      126,
      111,
      205,
      249,
      191,
      55,
      230,
      252,
      223,
      155,
      243,
      126,
      111,
      205,
      249,
      191,
      55,
      224
    ])
}));

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn().mockImplementation((_e, callback) => {
      callback();
    })
  }
}));

describe('handleRequest', () => {
  it('GET_ADDRESS returns address and uuid for PRIVATE_KEY', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: WalletType.PRIVATE_KEY,
      args: 'privkey'
    });

    expect(response).toStrictEqual({
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24'
    });
  });

  it('GET_ADDRESS returns a single address for MNEMONIC', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: WalletType.MNEMONIC,
      args: { phrase: fMnemonicPhrase, dPath: "m/44'/60'/0'/0/0" }
    });

    expect(response).toStrictEqual({
      address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4',
      dPath: "m/44'/60'/0'/0/0",
      privateKey: '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577',
      uuid: '304a57a4-1752-53db-8861-67785534e98e'
    });
  });

  it('GET_ADDRESS returns multiple addresses for MNEMONIC', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: WalletType.MNEMONIC,
      args: { phrase: fMnemonicPhrase, limit: 3, dPathBase: "m/44'/60'/0'/0" }
    });

    expect(response).toStrictEqual([
      {
        address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4',
        dPath: "m/44'/60'/0'/0/0",
        privateKey: '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577',
        uuid: '304a57a4-1752-53db-8861-67785534e98e'
      },
      {
        address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD',
        dPath: "m/44'/60'/0'/0/1",
        privateKey: '0xe5beed1478ba8ac07b84dda32f4e21b492582f6ffac0ec1e9cab157145cc7a9e',
        uuid: 'c0c919d6-444c-5a35-870a-dc520182d266'
      },
      {
        address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd',
        dPath: "m/44'/60'/0'/0/2",
        privateKey: '0x58852fb0f48eca12d50fa96509d65a8ee14875514b76f5ce869e1e267f761c13',
        uuid: '1dc59f57-b8d8-598a-83ac-8eb0b76e8b3a'
      }
    ]);
  });

  it('GET_ADDRESS fails with KEYSTORE', async () => {
    await expect(
      handleRequest({
        type: CryptoRequestType.GET_ADDRESS,
        // @ts-expect-error Invalid query for testing purposes
        wallet: WalletType.KEYSTORE,
        // @ts-expect-error Invalid query for testing purposes
        args: ''
      })
    ).rejects.toBeDefined();
  });

  it('SIGN returns signed tx', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.SIGN,
      privateKey: 'privkey',
      tx: {}
    });

    expect(response).toBe(
      '0xf86b1885012a05f200825208945197b5b062288bbf29008c92b08010a92dd677cd872386f26fc10000802aa0f59ba7d53009466f5acc79fc76a51818107c3ff3d8340ce91a1c99f272854104a01336d15b3ea9e66458d94d71a2a5bee498c176edb79e97c6ed12f2e47b74fac6'
    );
  });

  it('CREATE_WALLET returns mnemonic phrase', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.CREATE_WALLET,
      wallet: WalletType.MNEMONIC
    });

    expect(response).toBe(fMnemonicPhrase);
  });

  it('CREATE_WALLET fails with PRIVATE_KEY', async () => {
    await expect(
      handleRequest({
        type: CryptoRequestType.CREATE_WALLET,
        wallet: WalletType.PRIVATE_KEY
      })
    ).rejects.toBeDefined();
  });

  it('CREATE_WALLET fails with KEYSTORE', async () => {
    await expect(
      handleRequest({
        type: CryptoRequestType.CREATE_WALLET,
        wallet: WalletType.KEYSTORE
      })
    ).rejects.toBeDefined();
  });

  it('errors if non supported type is passed', async () => {
    await expect(
      handleRequest({
        // @ts-expect-error Unsupported type
        type: 'bla',
        privateKey: 'privkey'
      })
    ).rejects.toBeDefined();
  });
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.CRYPTO, expect.any(Function));
  });
});
