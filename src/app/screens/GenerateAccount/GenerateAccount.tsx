import React from 'react';

import { push } from 'connected-react-router';

import { Flow, IFlowComponent } from '@components';
import { useUnmount } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { setGeneratedAccount, useDispatch } from '@store';

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
