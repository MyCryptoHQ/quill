import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector as useReduxSelector } from 'react-redux';

import type { ApplicationState } from '../store';

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<ApplicationState> = useReduxSelector;
