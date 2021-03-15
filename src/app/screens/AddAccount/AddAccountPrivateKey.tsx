import React, { useState } from 'react';

import { Box, Button, Input, PanelBottom } from '@app/components';
import { fetchAccount, useDispatch } from '@app/store';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountPrivateKey = () => {
  const dispatch = useDispatch();
  const [privateKey, setPrivateKey] = useState('');
  const [persistent, setPersistent] = useState(false);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivateKey(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistent(e.currentTarget.checked);

  const handleSubmit = () => {
    dispatch(fetchAccount({ walletType: WalletType.PRIVATE_KEY, privateKey, persistent }));
  };

  return (
    <>
      <Box>
        <label>
          {translateRaw('PRIVATE_KEY')}
          <Input type="text" onChange={changePrivateKey} />
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
