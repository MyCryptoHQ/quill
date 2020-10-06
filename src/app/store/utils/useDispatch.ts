import { useDispatch as useReduxDispatch } from 'react-redux';

import { ApplicationDispatch } from '../store';

export const useDispatch: () => ApplicationDispatch = useReduxDispatch;
