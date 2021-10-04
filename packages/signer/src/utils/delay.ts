import { delay as sagaDelay } from 'redux-saga/effects';

/**
 * Wraps the delay function from `redux-saga` to make it testable.
 *
 * @param ms The number of milliseconds to delay for.
 */
export function* delay(ms: number) {
  yield sagaDelay(ms);
}
