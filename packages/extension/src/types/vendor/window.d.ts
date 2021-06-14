import type { Provider } from '../provider';

declare global {
  interface Window {
    ethereum: Provider;
  }
}
