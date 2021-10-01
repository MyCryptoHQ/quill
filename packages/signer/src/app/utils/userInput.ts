import { hexlify } from '@ethersproject/bytes';
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { addHexPrefix, bigify } from '@signer/common';
import type { TransactionRequest } from '@signer/common';

export type HumanReadableTx = ReturnType<typeof toHumanReadable>;

export const toHumanReadable = (tx: TransactionRequest) => ({
  ...tx,
  gasLimit: bigify(tx.gasLimit).toString(10),
  gasPrice: formatUnits(tx.gasPrice, 'gwei'),
  // @todo Consider units
  value: formatEther(tx.value),
  nonce: bigify(tx.nonce).toString(10),
  data: hexlify(tx.data)
});

export const fromHumanReadable = (tx: HumanReadableTx) => ({
  ...tx,
  gasLimit: addHexPrefix(bigify(tx.gasLimit).toString(16)),
  gasPrice: parseUnits(bigify(tx.gasPrice).toString(10), 'gwei').toHexString(),
  // @todo Consider units
  value: parseEther(bigify(tx.value).toString(10)).toHexString(),
  nonce: addHexPrefix(bigify(tx.nonce).toString(16))
});

export const sanitizeGasPriceInput = (input: string) => {
  const val = input.replace(',', '.');

  const split = val.toString().split('.');
  if (split.length > 1) {
    return `${split[0]}.${split[1].substring(0, 9)}`;
  }
  return val;
};
