import React, { useState } from 'react';

import { sign, useDispatch } from '@app/store';
import { SignTransactionProps, WalletType } from '@types';

export const SignTransactionMnemonic = ({ onDeny, currentAccount, tx }: SignTransactionProps) => {
  const dispatch = useDispatch();
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const handleAccept = async () => {
    if (currentAccount.persistent) {
      return dispatch(
        sign({
          wallet: {
            persistent: true,
            uuid: currentAccount.uuid
          },
          tx
        })
      );
    }

    dispatch(
      sign({
        wallet: {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: phrase,
          passphrase: password,
          path: currentAccount.dPath!
        },
        tx
      })
    );
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
