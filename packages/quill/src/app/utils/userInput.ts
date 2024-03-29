import { hexlify } from '@ethersproject/bytes';
import { formatEther, formatUnits, parseEther, parseUnits } from '@ethersproject/units';
import { addHexPrefix, bigify } from '@quill/common';
import type { TransactionRequest } from '@quill/common';

export type HumanReadableTx = ReturnType<typeof toHumanReadable>;

export const toHumanReadable = (tx: TransactionRequest) => {
  const gas =
    tx.type === 2
      ? {
          maxFeePerGas: formatUnits(tx.maxFeePerGas, 'gwei'),
          maxPriorityFeePerGas: formatUnits(tx.maxPriorityFeePerGas, 'gwei')
        }
      : { gasPrice: formatUnits(tx.gasPrice, 'gwei') };

  return {
    ...tx,
    gasLimit: bigify(tx.gasLimit).toString(10),
    ...gas,
    // @todo Consider units
    value: formatEther(tx.value),
    nonce: bigify(tx.nonce).toString(10),
    data: hexlify(tx.data)
  };
};

export const fromHumanReadable = (tx: HumanReadableTx) => {
  const gas =
    tx.type === 2
      ? {
          maxFeePerGas: parseUnits(bigify(tx.maxFeePerGas).toString(10), 'gwei').toHexString(),
          maxPriorityFeePerGas: parseUnits(
            bigify(tx.maxPriorityFeePerGas).toString(10),
            'gwei'
          ).toHexString()
        }
      : { gasPrice: parseUnits(bigify(tx.gasPrice).toString(10), 'gwei').toHexString() };
  return {
    ...tx,
    gasLimit: addHexPrefix(bigify(tx.gasLimit).toString(16)),
    ...gas,
    // @todo Consider units
    value: parseEther(bigify(tx.value).toString(10)).toHexString(),
    nonce: addHexPrefix(bigify(tx.nonce).toString(16))
  };
};

export const sanitizeGasPriceInput = (input: string) => {
  const val = input.replace(',', '.');

  const split = val.toString().split('.');
  if (split.length > 1) {
    return `${split[0]}.${split[1].substring(0, 9)}`;
  }
  return val;
};
