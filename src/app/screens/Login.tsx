import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { useDispatch } from '@app/store';
import { setLoggedIn } from '@app/store/auth';
import { ipcBridgeRenderer } from '@bridge';
import { DBRequestType } from '@types';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await ipcBridgeRenderer.db.invoke({ type: DBRequestType.LOGIN, password });
      if (!result) {
        setError('An error occurred');
      }
      dispatch(setLoggedIn(result));
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  return (
    <div>
      <label>
        Master Password
        <input id="password" name="password" type="password" onChange={changePassword} />
      </label>
      <br />
      <button type="button" disabled={password.length === 0} onClick={handleLogin}>
        Login
      </button>
      <br />
      <Link to={ROUTE_PATHS.FORGOT_PASSWORD}>Forgot Password?</Link>
      <br />
      {error}
    </div>
  );
};
