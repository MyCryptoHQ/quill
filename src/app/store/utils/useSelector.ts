import { TypedUseSelectorHook, useSelector as useReduxSelector } from 'react-redux';

import { ApplicationState } from '../store';

/**
 * Type-safe version of the `react-redux` useSelector hook.
 */
export const useSelector: TypedUseSelectorHook<ApplicationState> = useReduxSelector;