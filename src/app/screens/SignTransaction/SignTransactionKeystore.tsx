import React, { useState } from 'react';

import { SignBottom } from '@app/components';
import { translateRaw } from '@translations';
import { SignTransactionProps, WalletType } from '@types';

export const SignTransactionKeystore = ({
  onAccept,
  onDeny,
  currentAccount
}: SignTransactionProps) => {
  const [keystoreFile, setKeystoreFile] = useState<File>();
  const [password, setPassword] = useState('');

  const changeKeystore = (e: React.ChangeEvent<HTMLInputElement>) =>
    setKeystoreFile(e.currentTarget.files[0]);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const handleAccept = () => {
    // @todo Handle errors
    keystoreFile
      .text()
      .then((keystore) => onAccept({ walletType: WalletType.KEYSTORE, keystore, password }));
  };

  return (
    <>
      {currentAccount && !currentAccount.persistent && (
        <>
          <label>
            {translateRaw('KEYSTORE')}
            <input type="file" onChange={changeKeystore} />
          </label>
          <br />
          <label>
            {translateRaw('PASSWORD')}
            <input type="text" onChange={changePassword} value={password} />
          </label>
        </>
      )}
      <SignBottom
        disabled={(!keystoreFile || !password) && !currentAccount.persistent}
        handleAccept={handleAccept}
        handleDeny={onDeny}
      />
    </>
  );
};
