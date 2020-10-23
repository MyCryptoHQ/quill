import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { useAccounts } from '@app/hooks';
import { ROUTE_PATHS } from '@app/routing';
import { WalletType } from '@types';

export const AddAccountPrivateKey = () => {
  const { addAccountFromPrivateKey } = useAccounts();
  const history = useHistory();
  const [privKey, setPrivKey] = useState('');
  const [persistence, setPersistence] = useState(false);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivKey(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistence(e.currentTarget.checked);

  const handleSubmit = () => {
    addAccountFromPrivateKey(WalletType.PRIVATE_KEY, privKey, persistence);
    history.replace(ROUTE_PATHS.HOME);
  };

  return (
    <>
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
