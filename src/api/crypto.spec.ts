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

jest.mock('@ethersproject/random', () => ({
  randomBytes: jest
    .fn()
    .mockImplementation(() => [
      35,
      172,
      13,
      85,
      191,
      174,
      100,
      193,
      46,
      250,
      255,
      101,
      60,
      158,
      172,
      159,
      18,
      185,
      177,
      36,
      172,
      116,
      115,
      141,
      163,
      207,
      142,
      92,
      32,
      216,
      18,
      107
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

  it('GET_ADDRESS returns multiple addresses for MNEMONIC', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: WalletType.MNEMONIC,
      args: { phrase: fMnemonicPhrase, limit: 3, dPathBase: "m/44'/60'/0'/0" }
    });

    expect(response).toStrictEqual([
      {
        address: '0x34cB7016d4A6c13eFF9bb580B1Da6D3c46feeB10',
        dPath: "m/44'/60'/0'/0/0",
        index: 0,
        privateKey: '0x827207adb7a16d059733b097c5afdcb5373e746007a87e041a9d9d8e926abc93',
        uuid: 'b3625398-2e6d-5a71-ae1f-1122814753c0'
      },
      {
        address: '0xF0850b736BB0DE14AE95718569A5032C944e86C8',
        dPath: "m/44'/60'/0'/0/1",
        index: 1,
        privateKey: '0x33c7aaa433700ce3a8485b306e9e3a7e029533847167ea7ec3e99e49d3b577c0',
        uuid: '4175e739-2c60-5717-8e8a-a4f9974dcee2'
      },
      {
        address: '0xCB958551c3CfF671a1D712BCb03367A7C5F09340',
        dPath: "m/44'/60'/0'/0/2",
        index: 2,
        privateKey: '0xefca6a916e4c6ebe7d57da4aae2cf32d830330fb9d934fdc6f3a3f13db29f3f8',
        uuid: '20f9f970-b801-5cfb-9476-f8c0001c5acc'
      }
    ]);
  });

  it('GET_ADDRESS fails with KEYSTORE', async () => {
    await expect(
      handleRequest({
        type: CryptoRequestType.GET_ADDRESS,
        wallet: WalletType.KEYSTORE,
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
