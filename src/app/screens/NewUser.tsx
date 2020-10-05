import React, { useState } from 'react';

import { login } from '@app/services';
import { useDispatch } from '@app/store';
import { setLoginState } from '@app/store/loggedin';

export const NewUser = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    /**const result = await login(password);
    dispatch(setLoggedIn(result));
    if (!result) {
      setError('An error occurred');
    }**/
  };

  return (
    <div>
      Welcome!
      <label htmlFor="password">
        Enter a new master password
        <input
          id="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
      </label>
      <br />
      <button type="button" disabled={password.length === 0} onClick={handleLogin}>
        Create
      </button>
      <br />
      {error}
    </div>
  );
};
