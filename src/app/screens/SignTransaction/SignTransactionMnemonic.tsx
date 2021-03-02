import React, { useState } from 'react';

import { SignTransactionProps, WalletType } from '@types';

export const SignTransactionMnemonic = ({
  onAccept,
  onDeny,
  currentAccount,
  tx
}: SignTransactionProps) => {
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const handleAccept = async () => {
    return onAccept({
      walletType: WalletType.MNEMONIC,
      mnemonicPhrase: phrase,
      passphrase: password,
      path: currentAccount.dPath!
    });
  };

  return (
    <>
      {currentAccount && !currentAccount.persistent && (
        <>
          <label htmlFor="mnemonic">Mnemonic Phrase</label>
          <br />
          <input id="mnemonic" name="mnemonic" type="text" onChange={changeMnemonicPhrase} />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input id="password" name="password" type="text" onChange={changePassword} />
          <br />
        </>
      )}
      <button id="deny_button" type="button" disabled={!tx} onClick={onDeny}>
        Deny
      </button>
      <button
        id="accept_button"
        type="button"
        disabled={!tx || (phrase.length === 0 && !currentAccount.persistent)}
        onClick={handleAccept}
      >
        Accept
      </button>
    </>
  );
};
