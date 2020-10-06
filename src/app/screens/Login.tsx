import React, { useState } from 'react';

import { login } from '@app/services/DatabaseService';
import { useDispatch } from '@app/store';
import { setLoginState } from '@app/store/auth';
import { LoginState } from '@types';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await login(password);
      dispatch(setLoginState(result ? LoginState.LOGGED_IN : LoginState.LOGGED_OUT));
      if (!result) {
        setError('An error occurred');
      }
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
      {error}
    </div>
  );
};
