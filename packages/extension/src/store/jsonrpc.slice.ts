import type { PayloadAction, Slice } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface JsonRpcState {
  network: {
    providers: string[];
    chainId: number;
  };
}

const initialState: JsonRpcState = {
  network: {
    providers: ['https://api.mycryptoapi.com/eth'],
    chainId: 1
  }
};

const sliceName = 'jsonrpc';

const slice: Slice<JsonRpcState> = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    setNetwork(state, action: PayloadAction<{ providers: string[]; chainId: number }>) {
      state.network = action.payload;
    }
  }
});

export const { setNetwork } = slice.actions;
export default slice;
