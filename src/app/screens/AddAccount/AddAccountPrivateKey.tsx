import React, { useState } from 'react';

import { Body, Box, Button, Checkbox, Input, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountPrivateKey = () => {
  const dispatch = useDispatch();
  const [privateKey, setPrivateKey] = useState('');
  const [persistent, setPersistent] = useState(true);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivateKey(e.currentTarget.value);

  const togglePersistence = () => setPersistent(!persistent);

  const handleSubmit = () => {
    dispatch(fetchAccounts([{ walletType: WalletType.PRIVATE_KEY, privateKey, persistent }]));
  };

  return (
    <>
      <Box>
        <label>
          {translateRaw('PRIVATE_KEY')}
          <Input type="text" onChange={changePrivateKey} />
        </label>
      </Box>
      <PanelBottom pb="24px">
        <Button onClick={handleSubmit}>{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <Checkbox onChange={togglePersistence} checked={persistent} />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
