import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { ROUTE_PATHS } from '@app/routePaths';

export const AddAccount = () => {
  const { addAccountFromPrivateKey } = useAccounts();
  const [privKey, setPrivKey] = useState('');
  const [persistence, setPersistence] = useState(false);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivKey(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistence(e.currentTarget.checked);

  const handleSubmit = () => {
    addAccountFromPrivateKey(privKey, persistence);
  };

  return (
    <>
      <Link to={ROUTE_PATHS.HOME}>Back</Link>
      <br />
      <label>
        Private Key
        <input type="text" onChange={changePrivateKey} />
      </label>
      <br />
      <label>
        Persistence
        <input type="checkbox" onChange={changePersistence} checked={persistence} />
      </label>
      <br />
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </>
  );
};
