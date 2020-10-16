import React, { useState } from 'react';

import zxcvbn from 'zxcvbn';

import { init } from '@app/services/DatabaseService';
import { useDispatch } from '@app/store';
import { setLoggedIn, setNewUser } from '@app/store/auth';
import { REQUIRED_PASSWORD_STRENGTH } from '@config';

export const NewUser = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const passwordValidation = password.length > 0 ? zxcvbn(password) : null;

  const isPasswordStrong = passwordValidation
    ? passwordValidation.score >= REQUIRED_PASSWORD_STRENGTH
    : false;

  const handleCreate = async () => {
    try {
      const result = await init(password);
      dispatch(setNewUser(!result));
      if (!result) {
        setError('An error occurred');
      }
      dispatch(setLoggedIn(true));
    } catch (err) {
      setError(err.message);
    }
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const passwordFeedback =
    !isPasswordStrong && passwordValidation ? passwordValidation.feedback.warning : '';

  return (
    <div>
      Welcome!
      <br />
      <label>
        Enter a new master password
        <input id="password" name="password" type="password" onChange={changePassword} />
      </label>
      <br />
      {`Password Strength: ${isPasswordStrong ? 'OK' : ''} ${
        !isPasswordStrong && passwordValidation ? 'Password too weak' : ''
      } ${passwordFeedback}`}
      <br />
      <button
        id="create_button"
        type="button"
        disabled={password.length === 0 || !isPasswordStrong}
        onClick={handleCreate}
      >
        Create
      </button>
      <br />
      {error}
    </div>
  );
};
