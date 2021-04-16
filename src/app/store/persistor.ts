import type { EnhancedStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import type { ApplicationState } from '.';

export const createPersistor = (store: EnhancedStore<ApplicationState>) =>
  persistStore(store, { manualPersist: true });
