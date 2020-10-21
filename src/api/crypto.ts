import { TransactionRequest } from '@ethersproject/abstract-provider';
import { entropyToMnemonic, HDNode } from '@ethersproject/hdnode';
import { randomBytes } from '@ethersproject/random';
import { Wallet } from '@ethersproject/wallet';
import { ipcMain } from 'electron';

import { ipcBridgeMain } from '@bridge';
import { MNEMONIC_ENTROPY_BYTES } from '@config';
import {
  CryptoRequest,
  CryptoRequestType,
  CryptoResponse,
  GetMnemonicAddressesArgs,
  TAddress,
  WalletType
} from '@types';
import { addHexPrefix, generateDeterministicAddressUUID, toChecksumAddress } from '@utils';

const sign = (wallet: Wallet, tx: TransactionRequest) => {
  return wallet.signTransaction(tx);
};

const signWithPrivateKey = (privateKey: string, tx: TransactionRequest) => {
  return sign(new Wallet(addHexPrefix(privateKey)), tx);
};

const getPrivateKeyAddress = (privateKey: string) => {
  const address = new Wallet(addHexPrefix(privateKey)).address as TAddress;
  return { address, uuid: generateDeterministicAddressUUID(address) };
};

const createMnemonicWallet = () => {
  const entropy = randomBytes(MNEMONIC_ENTROPY_BYTES);
  return entropyToMnemonic(entropy);
};

const getMnemonicAddresses = ({
  dPathBase,
  limit,
  offset,
  phrase,
  password
}: {
  dPathBase: string;
  phrase: string;
  password?: string;
  offset?: number;
  limit: number;
}) => {
  const rootNode = HDNode.fromMnemonic(phrase, password);
  const addresses = [];
  for (let i = 0; i < limit; i++) {
    const index = i + offset;
    const dPath = `${dPathBase}/${index}`;
    const node = rootNode.derivePath(dPath);
    const address = toChecksumAddress(node.address) as TAddress;
    addresses.push({
      index,
      address,
      uuid: generateDeterministicAddressUUID(address),
      privateKey: node.privateKey,
      dPath
    });
  }
  return addresses;
};

export const handleRequest = async (request: CryptoRequest): Promise<CryptoResponse> => {
  switch (request.type) {
    case CryptoRequestType.SIGN: {
      const { privateKey, tx } = request;
      return signWithPrivateKey(privateKey, tx);
    }
    case CryptoRequestType.GET_ADDRESS: {
      const { args, wallet } = request;
      if (wallet === WalletType.PRIVATE_KEY) {
        return getPrivateKeyAddress(args as string);
      } else if (wallet === WalletType.MNEMONIC) {
        return getMnemonicAddresses(args as GetMnemonicAddressesArgs);
      }

      throw new Error('Unsupported wallet type');
    }
    case CryptoRequestType.CREATE_WALLET: {
      const { wallet } = request;
      if (wallet === WalletType.MNEMONIC) {
        return createMnemonicWallet();
      }
      throw new Error('Unsupported wallet type');
    }
    default:
      throw new Error('Undefined request type');
  }
};

export const runService = () => {
  ipcBridgeMain(ipcMain).crypto.handle((_e, request) => handleRequest(request));
};
