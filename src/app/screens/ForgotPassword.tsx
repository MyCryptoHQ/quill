import React from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { reset } from '@app/services/DatabaseService';
import { useDispatch } from '@app/store';
import { setNewUser } from '@app/store/auth';

export const ForgotPassword = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleReset = () => {
    reset();
    dispatch(setNewUser(true));
    redirectBack();
  };

  const redirectBack = () => {
    history.replace(ROUTE_PATHS.LOCKED);
  };

  return (
    <>
      Are you sure you want to reset?
      <br />
      <button onClick={handleReset}>Yes</button>
      <button onClick={redirectBack}>No</button>
    </>
  );
};
