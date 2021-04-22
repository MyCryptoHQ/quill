import type { DerivationPath } from '@mycrypto/wallets';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';

import type {
  GetAddressesResult,
  IAccount,
  SerializedDeterministicWallet,
  SerializedWallet,
  TAddress
} from '@types';

export interface AccountsState {
  accounts: IAccount[];
  addresses: GetAddressesResult[];
  isFetching: boolean;
  fetchError?: string;
  generatedAccount?: {
    mnemonicPhrase: string;
    address: TAddress;
  };
}

export const initialState: AccountsState = {
  accounts: [],
  addresses: [],
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
    setAddresses(state, action: PayloadAction<GetAddressesResult[]>) {
      state.addresses = action.payload;
    },
    fetchAccounts(state, _: PayloadAction<(SerializedWallet & { persistent: boolean })[]>) {
      state.isFetching = true;
      state.fetchError = undefined;
    },
    fetchAddresses(
      state,
      _: PayloadAction<{
        wallet: SerializedDeterministicWallet;
        path: DerivationPath;
        limit: number;
        offset: number;
      }>
    ) {
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
  setAddresses,
  fetchAccounts,
  fetchAddresses,
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

export const getAddresses = createSelector(
  (state: { accounts: AccountsState }) => state.accounts,
  (accounts) => accounts.addresses ?? []
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
