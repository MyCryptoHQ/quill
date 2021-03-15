import React, { useState } from 'react';

import { Box, Button, FileBox, Input, PanelBottom } from '@app/components';
import { fetchAccount, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountKeystore = () => {
  const dispatch = useDispatch();
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
    });
  };

  return (
    <>
      <Box>
        <label>
          {translateRaw('KEYSTORE')}
          <FileBox onChange={changeKeystore} />
        </label>
      </Box>
      <Box>
        <label>
          {translateRaw('PASSWORD')}
          <Input type="text" onChange={changePassword} value={password} />
        </label>
      </Box>
      <Box>
        <label>
          {translateRaw('PERSISTENCE')}
          <input type="checkbox" onChange={changePersistence} checked={persistent} />
        </label>
      </Box>
      <PanelBottom>
        <Button onClick={handleSubmit}>{translateRaw('SUBMIT')}</Button>
      </PanelBottom>
    </>
  );
};
