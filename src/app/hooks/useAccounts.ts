import { deletePrivateKey, getAddress, savePrivateKey } from '@app/services';
import { useDispatch, useSelector } from '@app/store';
import { GetPrivateKeyAddressResult, IAccount, WalletType } from '@types';

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
    const { address, uuid } = (await getAddress({
      wallet: WalletType.PRIVATE_KEY,
      args: privateKey
    })) as GetPrivateKeyAddressResult;
    if (persistent) {
      await savePrivateKey(uuid, privateKey);
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
      await deletePrivateKey(account.uuid);
    }
  };

  return { accounts: Object.values(accounts), addAccount, addAccountFromPrivateKey, removeAccount };
}
