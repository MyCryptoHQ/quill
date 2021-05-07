import { push } from 'connected-react-router';

import { fetchReset, setAccountsToAdd } from '@common/store';
import type { IFlowComponent } from '@components';
import { Flow } from '@components';
import { useUnmount } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { useDispatch } from '@store';

import { AddAccountBackup } from './AddAccountBackup';
import { AddAccountEnd } from './AddAccountEnd';
import { AddAccountSecurity } from './AddAccountSecurity';
import { AddAccountStart } from './AddAccountStart';

const components: IFlowComponent[] = [
  {
    component: AddAccountStart
  },
  {
    component: AddAccountSecurity
  },
  {
    component: AddAccountBackup
  },
  {
    component: AddAccountEnd
  }
];

export const AddAccount = () => {
  const dispatch = useDispatch();

  const handleDone = () => {
    dispatch(push(ROUTE_PATHS.HOME));
  };

  useUnmount(() => {
    dispatch(fetchReset());
    dispatch(setAccountsToAdd([]));
  });

  return <Flow components={components} onDone={handleDone} />;
};
