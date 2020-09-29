import { TransactionResponse } from '@ethersproject/abstract-provider';

import { default as ethTxResponse } from './ethTxResponse.json';

export const fTxResponse = ethTxResponse as TransactionResponse;
