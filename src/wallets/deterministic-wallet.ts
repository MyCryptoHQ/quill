import { Wallet } from '@wallets/wallet';
import { TAddress } from '@types';

export abstract class DeterministicWallet {
  abstract async getAddress(path: string): Promise<TAddress>;
  abstract async getWallet (path: string): Promise<Wallet>;

  getAddresses(options: { path: string, limit: number, offset: number = 0 }) {
    // TODO
  }


}
