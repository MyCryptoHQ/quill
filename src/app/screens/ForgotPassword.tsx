import React from 'react';

import { replace } from 'connected-react-router';

import { ROUTE_PATHS } from '@app/routing';
import { setNewUser, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const ForgotPassword = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    ipcBridgeRenderer.db.invoke({ type: DBRequestType.RESET });
    dispatch(setNewUser(true));
    redirectBack();
  };

  const redirectBack = () => {
    dispatch(replace(ROUTE_PATHS.LOCKED));
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
