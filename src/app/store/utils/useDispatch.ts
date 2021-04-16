import { useDispatch as useReduxDispatch } from 'react-redux';

import type { ApplicationDispatch } from '../store';

export const useDispatch: () => ApplicationDispatch = useReduxDispatch;
