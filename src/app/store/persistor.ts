import { EnhancedStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import { ApplicationState } from '.';

export const createPersistor = (store: EnhancedStore<ApplicationState>) =>
  persistStore(store, { manualPersist: true });
