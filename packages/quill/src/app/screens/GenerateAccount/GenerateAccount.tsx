import { setGeneratedAccount } from '@quill/common';
import { push } from 'connected-react-router';

import type { IFlowComponent } from '@components';
import { Flow } from '@components';
import { useUnmount } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { useDispatch } from '@store';

import { GenerateAccountEnd } from './GenerateAccountEnd';
import { GenerateAccountMnemonic } from './GenerateAccountMnemonic';
import { GenerateAccountStart } from './GenerateAccountStart';
import { GenerateAccountVerify } from './GenerateAccountVerify';

const components: IFlowComponent[] = [
  {
    component: GenerateAccountStart
  },
  {
    component: GenerateAccountMnemonic
  },
  {
    component: GenerateAccountVerify
  },
  {
    component: GenerateAccountEnd
  }
];

export const GenerateAccount = () => {
  const dispatch = useDispatch();

  const handleDone = () => {
    dispatch(push(ROUTE_PATHS.HOME));
  };

  useUnmount(() => {
    dispatch(setGeneratedAccount(undefined));
  });

  return <Flow components={components} onDone={handleDone} />;
};
