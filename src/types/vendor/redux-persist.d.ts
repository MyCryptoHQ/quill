import 'redux-persist/es/types';

declare module 'redux-persist/es/types' {
  interface PersistorOptions {
    manualPersist: boolean;
  }
}
