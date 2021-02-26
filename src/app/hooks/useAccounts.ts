import { useDispatch, useSelector } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import {
  CryptoRequestType,
  DBRequestType,
  GetPrivateKeyAddressResult,
  IAccount,
  WalletType
} from '@types';

import {
  addAccount as addAccountRedux,
  removeAccount as removeAccountRedux
} from '../store/account';

export function useAccounts() {
  const accounts = useSelector((state) => state.accounts.accounts);
  const dispatch = useDispatch();

  const addAccount = (account: IAccount) => {
    dispatch(addAccountRedux(account));
  };

  const addAccountFromPrivateKey = async (
    wallet: WalletType,
    privateKey: string,
    persistent: boolean,
    dPath?: string
  ) => {
    const { address, uuid } = (await ipcBridgeRenderer.crypto.invoke({
      type: CryptoRequestType.GET_ADDRESS,
      wallet: WalletType.PRIVATE_KEY,
      args: privateKey
    })) as GetPrivateKeyAddressResult;
    if (persistent) {
      await ipcBridgeRenderer.db.invoke({ type: DBRequestType.SAVE_PRIVATE_KEY, uuid, privateKey });
    }
    addAccount({
      uuid,
      type: wallet,
      address,
      persistent,
      dPath
    });
  };

  const removeAccount = async (account: IAccount) => {
    dispatch(removeAccountRedux(account));
    if (account.persistent) {
      await ipcBridgeRenderer.db.invoke({
        type: DBRequestType.DELETE_PRIVATE_KEY,
        uuid: account.uuid
      });
    }
  };

  return { accounts: Object.values(accounts), addAccount, addAccountFromPrivateKey, removeAccount };
}
