export enum IPC_CHANNELS {
  CRYPTO = 'crypto',
  API = 'api',
  DATABASE = 'db'
}

export const SUPPORTED_METHODS = {
  SIGN_TRANSACTION: 'eth_signTransaction',
  ACCOUNTS: 'eth_accounts'
};

export const WS_PORT = 8000;

export const HEIGHT = 450;
export const WIDTH = 300;

// @todo Change to another name?
export const KEYTAR_SERVICE = 'MyCrypto Signer';

export const REQUIRED_PASSWORD_STRENGTH = 3;
