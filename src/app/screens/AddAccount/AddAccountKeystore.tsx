import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { fetchAccount, useDispatch } from '@app/store';
import { WalletType } from '@types';

export const AddAccountKeystore = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [keystoreFile, setKeystoreFile] = useState<File>();
  const [password, setPassword] = useState('');
  const [persistent, setPersistent] = useState(false);

  const changeKeystore = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeystoreFile(e.currentTarget.files[0]);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistent(e.currentTarget.checked);

  const handleSubmit = () => {
    // @todo Handle errors
    keystoreFile.text().then((keystore) => {
      dispatch(fetchAccount({ walletType: WalletType.KEYSTORE, keystore, password, persistent }));
      history.replace(ROUTE_PATHS.HOME);
    });
  };

  return (
    <>
      <label>
        Keystore
        <input type="file" onChange={changeKeystore} />
      </label>
      <br />
      <label>
        Password
        <input type="text" onChange={changePassword} value={password} />
      </label>
      <br />
      <label>
        Persistence
        <input type="checkbox" onChange={changePersistence} checked={persistent} />
      </label>
      <br />
      <input type="submit" value="Submit" onClick={handleSubmit} />
    </>
  );
};
