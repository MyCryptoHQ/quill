import { ipcMain } from 'electron';

import { IPC_CHANNELS } from '@config';
import { CryptoRequestType } from '@types';

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

jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn()
  }
}));

describe('handleRequest', () => {
  it('GET_ADDRESS returns address and uuid', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      privateKey: 'privkey'
    });

    expect(response).toStrictEqual({
      address: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      uuid: '4be38596-5d9c-5c01-8e04-19d1c726fe24'
    });
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
});

describe('runService', () => {
  it('calls ipcMain handle', () => {
    runService();
    expect(ipcMain.handle).toHaveBeenCalledWith(IPC_CHANNELS.CRYPTO, expect.any(Function));
  });
});
