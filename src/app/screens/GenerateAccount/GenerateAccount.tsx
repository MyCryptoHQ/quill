import React, { useEffect } from 'react';

import { ROUTE_PATHS } from '@routing';
import { push } from 'connected-react-router';

import { Flow, IFlowComponent } from '@components';
import { GenerateAccountEnd } from '@screens/GenerateAccount/GenerateAccountEnd';
import { setGeneratedAccount, useDispatch } from '@store';

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

  useEffect(() => {
    // Clears generated account on unmount
    return () => dispatch(setGeneratedAccount(undefined));
  });

  return <Flow components={components} onDone={handleDone} />;
};
