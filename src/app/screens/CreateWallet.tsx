import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { createMnemonic } from '@app/services/WalletService';

export const CreateWallet = () => {
  const [phrase, setMnemonicPhrase] = useState('');
  const history = useHistory();

  const handleCreateMnemonic = async () => {
    const result = await createMnemonic();
    setMnemonicPhrase(result);
  };

  const handleOK = () => {
    history.replace(ROUTE_PATHS.HOME);
  };

  return (
    <>
      {phrase.length > 0 && (
        <>
          {phrase}
          <br />
          Please write down this phrase!
          <br />
          <button onClick={handleOK}>OK</button>
        </>
      )}
      {phrase.length == 0 && <button onClick={handleCreateMnemonic}>Create Mnemonic Phrase</button>}
    </>
  );
};
