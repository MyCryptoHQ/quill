import React, { useState } from 'react';

import { login } from '@app/services';
import { useDispatch } from '@app/store';
import { setLoginState } from '@app/store/loggedin';
import { LoginState } from '@types/db';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const result = await login(password);
    dispatch(setLoginState(result ? LoginState.LOGGED_IN : LoginState.LOGGED_OUT));
    if (!result) {
      setError('An error occurred');
    }
  };

  return (
    <div>
      <label htmlFor="password">
        Master Password
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
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
