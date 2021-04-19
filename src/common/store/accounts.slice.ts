import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import type { IAccount, SerializedWallet, TAddress } from '@types';

export interface AccountsState {
  accounts: IAccount[];
  isFetching: boolean;
  fetchError?: string;
  generatedAccount?: {
    mnemonicPhrase: string;
    address: TAddress;
  };
}

export const initialState: AccountsState = {
  accounts: [],
  isFetching: false
};

const sliceName = 'accounts';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<IAccount>) {
      state.accounts.push(action.payload);
      state.fetchError = undefined;
      state.isFetching = false;
    },
    removeAccount(state, action: PayloadAction<IAccount>) {
      const idx = state.accounts.findIndex((a) => a.uuid === action.payload.uuid);
      state.accounts.splice(idx, 1);
    },
    updateAccount(state, action: PayloadAction<IAccount>) {
      const idx = state.accounts.findIndex((a) => a.uuid === action.payload.uuid);
      state.accounts[idx] = action.payload;
    },
    fetchAccounts(state, _: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
      state.isFetching = true;
      state.fetchError = undefined;
    },
    fetchFailed(state, action: PayloadAction<string>) {
      state.isFetching = false;
      state.fetchError = action.payload;
    },
    fetchReset(state) {
      state.isFetching = false;
      state.fetchError = undefined;
    },
    setGeneratedAccount(
      state,
      action: PayloadAction<{ mnemonicPhrase: string; address: TAddress } | undefined>
    ) {
      state.generatedAccount = action.payload;
    }
  }
});

export const {
  addAccount,
  removeAccount,
  updateAccount,
  fetchAccounts,
  fetchFailed,
  fetchReset,
  setGeneratedAccount
} = slice.actions;

export const generateAccount = createAction(`${sliceName}/generateAccount`);

export default slice;

export const reducer = slice.reducer;

export const getAccounts = createSelector(
  (state: { accounts: AccountsState }) => state.accounts,
  (accounts) => accounts.accounts
);

export const getAccountError = createSelector(
  (state: { accounts: AccountsState }) => state.accounts,
  (accounts) => accounts.fetchError
);

export const getAccountsLength = createSelector(getAccounts, (accounts) => accounts.length);

export const getGeneratedAccount = createSelector(
  (state: { accounts: AccountsState }) => state.accounts,
  (accounts) => accounts.generatedAccount
);

export const getGeneratedMnemonicWords = createSelector(getGeneratedAccount, (account) =>
  account?.mnemonicPhrase.split(' ')
);
