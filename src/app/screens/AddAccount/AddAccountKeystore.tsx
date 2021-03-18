import React, { useState } from 'react';

import { Body, Box, Button, Checkbox, FileBox, Input, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountKeystore = () => {
  const dispatch = useDispatch();
  const [keystoreFile, setKeystoreFile] = useState<File>();
  const [password, setPassword] = useState('');
  const [persistent, setPersistent] = useState(true);

  const changeKeystore = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeystoreFile(e.currentTarget.files[0]);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const togglePersistence = () => setPersistent(!persistent);

  const handleSubmit = () => {
    // @todo Handle errors
    keystoreFile.text().then((keystore) => {
      dispatch(
        fetchAccounts([{ walletType: WalletType.KEYSTORE, keystore, password, persistent }])
      );
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
      <PanelBottom pb="24px">
        <Button onClick={handleSubmit}>{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <Checkbox
            onChange={togglePersistence}
            checked={persistent}
            data-testid="toggle-persistence"
          />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
