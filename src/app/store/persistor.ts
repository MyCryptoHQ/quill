import { EnhancedStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import { ApplicationState } from '.';

export const createPersistor = (store: EnhancedStore<ApplicationState>) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  persistStore(store, { manualPersist: true });
