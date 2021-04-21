export enum IPC_CHANNELS {
  REDUX = 'redux',
  CRYPTO = 'crypto',
  API = 'api'
}

export enum JsonRPCMethod {
  SignTransaction = 'eth_signTransaction',
  Accounts = 'eth_accounts'
}

export const WS_PORT = 8000;

export const HEIGHT = 600;
export const WIDTH = 460;

// @todo Change to another name?
export const KEYTAR_SERVICE = 'MyCrypto Signer';

export const MNEMONIC_ENTROPY_BYTES = 32;
