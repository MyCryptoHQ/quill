import React, { useState } from 'react';

import { SignBottom } from '@app/components';
import { translateRaw } from '@translations';
import { SignTransactionProps, WalletType } from '@types';

export const SignTransactionMnemonic = ({
  onAccept,
  onDeny,
  currentAccount
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
          <label htmlFor="mnemonic">{translateRaw('MNEMONIC_PHRASE')}</label>
          <br />
          <input id="mnemonic" name="mnemonic" type="text" onChange={changeMnemonicPhrase} />
          <br />
          <label htmlFor="password">{translateRaw('PASSWORD')}</label>
          <br />
          <input id="password" name="password" type="text" onChange={changePassword} />
          <br />
        </>
      )}
      <SignBottom
        disabled={phrase.length === 0 && !currentAccount.persistent}
        handleAccept={handleAccept}
        handleDeny={onDeny}
      />
    </>
  );
};
