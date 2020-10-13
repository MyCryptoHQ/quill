import React, { useState } from 'react';

import { setEncryptionKey } from '@app/services';
import { login } from '@app/services/DatabaseService';
import { useDispatch } from '@app/store';
import { setLoggedIn } from '@app/store/auth';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await login(password);
      if (!result) {
        setError('An error occurred');
      } else {
        await setEncryptionKey(password);
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
      {error}
    </div>
  );
};
