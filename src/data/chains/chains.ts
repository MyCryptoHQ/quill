import { IChain } from '@types';

import chains from './chains.json';

export const getChain = (chainId: number): IChain | undefined => {
  return chains.find((c) => c.chainId === chainId);
};
