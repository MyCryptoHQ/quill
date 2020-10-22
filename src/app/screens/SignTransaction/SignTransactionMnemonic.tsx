import React, { useState } from 'react';

import { getAddress } from '@app/services';
import { GetMnemonicAddressesResult, SignTransactionProps, WalletType } from '@types';

export const SignTransactionMnemonic = ({
  onAccept,
  onDeny,
  hasPersistentPrivateKey,
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
    if (!hasPersistentPrivateKey) {
      const { privateKey } = (await getAddress({
        wallet: WalletType.MNEMONIC,
        args: { dPath: currentAccount.dPath, phrase, password }
      })) as GetMnemonicAddressesResult;
      onAccept(privateKey);
    } else {
      onAccept('');
    }
  };

  return (
    <>
      {currentAccount && !hasPersistentPrivateKey && (
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
        disabled={!tx || (phrase.length === 0 && !hasPersistentPrivateKey)}
        onClick={handleAccept}
      >
        Accept
      </button>
    </>
  );
};
