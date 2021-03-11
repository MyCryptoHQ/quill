import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { fetchAccount, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountPrivateKey = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [privateKey, setPrivateKey] = useState('');
  const [persistent, setPersistent] = useState(false);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivateKey(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistent(e.currentTarget.checked);

  const handleSubmit = () => {
    dispatch(fetchAccount({ walletType: WalletType.PRIVATE_KEY, privateKey, persistent }));
    history.replace(ROUTE_PATHS.HOME);
  };

  return (
    <>
      <label>
        {translateRaw('PRIVATE_KEY')}
        <input type="text" onChange={changePrivateKey} />
      </label>
      <br />
      <label>
        {translateRaw('PERSISTENCE')}
        <input type="checkbox" onChange={changePersistence} checked={persistent} />
      </label>
      <br />
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </>
  );
};
