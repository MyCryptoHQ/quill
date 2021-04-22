import type { TransactionRequest } from '@ethersproject/abstract-provider';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { ApplicationState } from '@store';
import type { SerializedPersistentAccount, SerializedWallet } from '@types';

export const initialState = { isSigning: false, error: undefined as string | undefined };

const sliceName = 'signing';

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    init(_, __: PayloadAction<string>) {
      // noop
    },
    sign(
      state,
      _: PayloadAction<{
        wallet: SerializedWallet | SerializedPersistentAccount;
        tx: TransactionRequest;
      }>
    ) {
      state.isSigning = true;
    },
    signSuccess(state) {
      state.isSigning = false;
      state.error = undefined;
    },
    signFailed(state, action: PayloadAction<string>) {
      state.isSigning = false;
      state.error = action.payload;
    }
  }
});

export const { init, sign, signSuccess, signFailed } = slice.actions;

export default slice;

export const getSigningError = createSelector(
  (state: ApplicationState) => state.signing,
  (signing) => signing.error
);
