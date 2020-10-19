import React from 'react';

import { useSelector } from '@app/store';

import { Login } from './Login';
import { NewUser } from './NewUser';

export const Locked = () => {
  const { newUser } = useSelector((state) => state.auth);
  if (newUser) {
    return <NewUser />;
  }
  return <Login />;
};
