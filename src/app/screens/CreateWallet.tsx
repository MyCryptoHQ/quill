import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType, WalletType } from '@types';

export const CreateWallet = () => {
  const [phrase, setMnemonicPhrase] = useState('');
  const history = useHistory();

  const handleCreateMnemonic = async () => {
    const result = await ipcBridgeRenderer.crypto.invoke({
      type: CryptoRequestType.CREATE_WALLET,
      wallet: WalletType.MNEMONIC
    });
    setMnemonicPhrase(result);
  };

  const handleOK = () => {
    history.replace(ROUTE_PATHS.ADD_ACCOUNT);
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
