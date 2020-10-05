import React, { useState } from 'react';

import { init } from '@app/services/DatabaseService';
import { useDispatch } from '@app/store';
import { setLoginState } from '@app/store/login';
import { LoginState } from '@types';

export const NewUser = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleCreate = async () => {
    const result = await init(password);
    dispatch(setLoginState(result ? LoginState.LOGGED_IN : LoginState.NEW_USER));
    if (!result) {
      setError('An error occurred');
    }
  };

  return (
    <div>
      Welcome!
      <br />
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
      <button type="button" disabled={password.length === 0} onClick={handleCreate}>
        Create
      </button>
      <br />
      {error}
    </div>
  );
};
