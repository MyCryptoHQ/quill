import keystores from './keystore.json';

export const fPrivateKey = '0x93b3701cf8eeb6f7d3b22211c691734f24816a02efa933f67f34d37053182577';

// Encrypted version of the private key above
export const fKeystore = JSON.stringify(keystores.v3[0].json);
export const fKeystorePassword = keystores.v3[0].password;

export const fKeystoreVectors = keystores;

export const fEncryptionPrivateKey =
  '0x89232f41ea0bc8099cd3a4abea50658c7012be675e605d0ca673bd1ec5305bfc';
export const fEncryptionPublicKey =
  '0x0209ccf5b21b6ea99c59101fe71b5a2e6e824643a2c88761f0c4c9219401dd592f';
