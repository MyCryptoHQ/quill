import { EnhancedStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import { ApplicationState } from '.';

export const createPersistor = (store: EnhancedStore<ApplicationState>) =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore For some reason the current version of redux-persist typing doesn't include manualPersist
  persistStore(store, { manualPersist: true });
