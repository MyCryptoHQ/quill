import { ipcMain } from 'electron';

import { getPrivateKey } from '@api/db';
import { IPC_CHANNELS } from '@config';
import { fMnemonicPhrase } from '@fixtures';
import { CryptoRequestType, TUuid, WalletType } from '@types';

import { handleRequest, runService } from './crypto';

const mockPrivateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';

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

jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn()
  }));
});

jest.mock('@api/db', () => ({
  getPrivateKey: jest.fn().mockImplementation(() => mockPrivateKey)
}));

describe('handleRequest', () => {
  it('GET_ADDRESS returns address for PRIVATE_KEY', async () => {
    const response = await handleRequest({
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey: mockPrivateKey
      },
      type: CryptoRequestType.GET_ADDRESS
    });

    expect(response).toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');
  });

  it('GET_ADDRESS returns a single address for MNEMONIC', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: fMnemonicPhrase,
        path: "m/44'/60'/0'/0/0"
      }
    });

    expect(response).toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');
  });

  it('GET_ADDRESSES returns multiple addresses for MNEMONIC', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.GET_ADDRESSES,
      limit: 3,
      offset: 0,
      path: "m/44'/60'/0'/0",
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: fMnemonicPhrase
      }
    });

    expect(response).toStrictEqual([
      {
        address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4',
        dPath: "m/44'/60'/0'/0/0"
      },
      {
        address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD',
        dPath: "m/44'/60'/0'/0/1"
      },
      {
        address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd',
        dPath: "m/44'/60'/0'/0/2"
      }
    ]);
  });

  it('GET_ADDRESSES fails with KEYSTORE', async () => {
    await expect(
      handleRequest({
        type: CryptoRequestType.GET_ADDRESSES,
        wallet: {
          // @ts-expect-error Invalid wallet type
          walletType: WalletType.KEYSTORE
        }
      })
    ).rejects.toBeDefined();
  });

  it('SIGN returns signed tx', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.SIGN,
      wallet: {
        walletType: WalletType.PRIVATE_KEY,
        privateKey: mockPrivateKey
      },
      tx: {
        nonce: 6,
        gasPrice: '0x012a05f200',
        gasLimit: '0x5208',
        to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
        value: '0x2386f26fc10000',
        data: '0x',
        chainId: 3
      }
    });

    expect(response).toBe(
      '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3'
    );
  });

  it('SIGN returns signed transaction for persistent accounts', async () => {
    const response = await handleRequest({
      type: CryptoRequestType.SIGN,
      wallet: {
        persistent: true,
        uuid: '709879a4-2241-4c07-8c83-16048e47d502' as TUuid
      },
      tx: {
        nonce: 6,
        gasPrice: '0x012a05f200',
        gasLimit: '0x5208',
        to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
        value: '0x2386f26fc10000',
        data: '0x',
        chainId: 3
      }
    });

    expect(getPrivateKey).toHaveBeenCalledWith('709879a4-2241-4c07-8c83-16048e47d502');
    expect(response).toBe(
      '0xf86b0685012a05f20082520894b2bb2b958afa2e96dab3f3ce7162b87daea39017872386f26fc10000802aa0686df061021262b4e75eb1608c8baaf043cca2b5ac68fb24420ede62d13a8a7fa035389237414433ac06a33d95c863b8221fe2c797a9c650c47a555255be0234f3'
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
