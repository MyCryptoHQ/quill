import React, { useState } from 'react';

import { init } from '@app/services/DatabaseService';
import { setEncryptionKey } from '@app/services/SecretsService';
import { useDispatch } from '@app/store';
import { setLoggedIn, setNewUser } from '@app/store/auth';

export const NewUser = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleCreate = async () => {
    try {
      const result = await init(password);
      dispatch(setNewUser(!result));
      if (!result) {
        setError('An error occurred');
      } else {
        await setEncryptionKey(password);
      }
      dispatch(setLoggedIn(true));
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  return (
    <div>
      Welcome!
      <br />
      <label>
        Enter a new master password
        <input id="password" name="password" type="password" onChange={changePassword} />
      </label>
      <br />
      <button
        id="create_button"
        type="button"
        disabled={password.length === 0}
        onClick={handleCreate}
      >
        Create
      </button>
      <br />
      {error}
    </div>
  );
};
