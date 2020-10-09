import { getAddressFromPrivateKey } from '@app/services';
import { useDispatch, useSelector } from '@app/store';
import { AccountType, IAccount } from '@types';

import {
  addAccount as addAccountRedux,
  removeAccount as removeAccountRedux
} from '../store/account';

export function useAccounts() {
  const accounts = useSelector((state) => state.accounts);
  const dispatch = useDispatch();

  const addAccount = (account: IAccount) => {
    dispatch(addAccountRedux(account));
  };

  const addAccountFromPrivateKey = async (privateKey: string, persistent: boolean) => {
    const { address, uuid } = await getAddressFromPrivateKey(privateKey);
    // @todo Handle persistence
    addAccount({
      uuid,
      type: AccountType.PRIVATE_KEY,
      address,
      persistent
    });
  };

  const removeAccount = (account: IAccount) => {
    dispatch(removeAccountRedux(account));
  };

  return { accounts, addAccount, addAccountFromPrivateKey, removeAccount };
}
