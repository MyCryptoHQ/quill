import { DEFAULT_ETH } from '@mycrypto/wallets';
import type { TUuid } from '@signer/common';
import { WalletType } from '@signer/common';

import { fKeystore, fKeystorePassword, fMnemonicPhrase, fPrivateKey, fSignedTx } from '@fixtures';

import { createWallet, getAddress, getAddresses, signTransaction } from './crypto';
import { getPrivateKey } from './secrets';

jest.unmock('@bridge');

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

jest.mock('electron-store', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    clear: jest.fn()
  }));
});

const mockPrivateKey = fPrivateKey;
jest.mock('./secrets', () => ({
  getPrivateKey: jest.fn().mockImplementation(() => mockPrivateKey)
}));

describe('signTransaction', () => {
  it('signs a transaction', async () => {
    await expect(
      signTransaction(
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: fPrivateKey
        },
        {
          nonce: 6,
          gasPrice: '0x012a05f200',
          gasLimit: '0x5208',
          to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
          value: '0x2386f26fc10000',
          data: '0x',
          chainId: 3
        }
      )
    ).resolves.toBe(fSignedTx);
  });

  it('signs a transaction for a persistent account', async () => {
    await expect(
      signTransaction(
        {
          persistent: true,
          uuid: '709879a4-2241-4c07-8c83-16048e47d502' as TUuid
        },
        {
          nonce: 6,
          gasPrice: '0x012a05f200',
          gasLimit: '0x5208',
          to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
          value: '0x2386f26fc10000',
          data: '0x',
          chainId: 3
        }
      )
    ).resolves.toBe(fSignedTx);

    expect(getPrivateKey).toHaveBeenCalledWith('709879a4-2241-4c07-8c83-16048e47d502');
  });

  it('throws if persistent account doesnt exist', async () => {
    (getPrivateKey as jest.MockedFunction<typeof getPrivateKey>).mockImplementationOnce(() => null);

    return expect(
      signTransaction(
        {
          persistent: true,
          uuid: '709879a4-2241-4c07-8c83-16048e47d502' as TUuid
        },
        {
          nonce: 6,
          gasPrice: '0x012a05f200',
          gasLimit: '0x5208',
          to: '0xb2bb2b958AFa2e96dab3f3Ce7162b87daEa39017',
          value: '0x2386f26fc10000',
          data: '0x',
          chainId: 3
        }
      )
    ).rejects.toThrow('Saved Private Key is invalid');
  });
});

describe('getAddress', () => {
  it('returns the address for a private key', async () => {
    await expect(
      getAddress({
        walletType: WalletType.PRIVATE_KEY,
        privateKey: fPrivateKey
      })
    ).resolves.toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');
  });

  it('returns the address for a keystore', async () => {
    await expect(
      getAddress({
        walletType: WalletType.KEYSTORE,
        keystore: fKeystore,
        password: fKeystorePassword
      })
    ).resolves.toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');
  });

  it('returns the address for a mnemonic phrase', async () => {
    await expect(
      getAddress({
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: fMnemonicPhrase,
        path: DEFAULT_ETH,
        index: 0
      })
    ).resolves.toBe('0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4');
  });
});

describe('createWallet', () => {
  it('returns a mnemonic phrase', async () => {
    await expect(createWallet(WalletType.MNEMONIC)).resolves.toBe(fMnemonicPhrase);
  });

  it('throws for invalid wallet types', async () => {
    await expect(createWallet(WalletType.PRIVATE_KEY)).rejects.toThrow();
    await expect(createWallet(WalletType.KEYSTORE)).rejects.toThrow();
  });
});

describe('getAddresses', () => {
  it('returns multiple addresses for a mnemonic phrase', async () => {
    const dPathInfo = {
      name: 'Default (ETH)',
      path: "m/44'/60'/0'/0/<account>"
    };
    await expect(
      getAddresses(
        {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: fMnemonicPhrase
        },
        DEFAULT_ETH,
        3,
        0
      )
    ).resolves.toStrictEqual([
      {
        address: '0x0961Ca10D49B9B8e371aA0Bcf77fE5730b18f2E4',
        dPath: "m/44'/60'/0'/0/0",
        dPathInfo,
        index: 0
      },
      {
        address: '0xa34F236d4Ead4D668b9335891f1BC4011A92B2CD',
        dPath: "m/44'/60'/0'/0/1",
        dPathInfo,
        index: 1
      },
      {
        address: '0x5e147f4A4224428c2978dca3A95aee7625FDB3Fd',
        dPath: "m/44'/60'/0'/0/2",
        dPathInfo,
        index: 2
      }
    ]);
  });

  it('throws an error for non-deterministic wallet types', async () => {
    await expect(
      getAddresses(
        {
          // @ts-expect-error Invalid wallet type
          walletType: WalletType.KEYSTORE,
          keystore: fKeystore,
          password: fKeystorePassword
        },
        DEFAULT_ETH,
        3,
        0
      )
    ).rejects.toThrow();
  });
});
