import React, { useState } from 'react';

import { SignBottom } from '@app/components';
import { translateRaw } from '@translations';
import { SignTransactionProps, WalletType } from '@types';

export const SignTransactionPrivateKey = ({
  onAccept,
  onDeny,
  currentAccount
}: SignTransactionProps) => {
  const [privKey, setPrivKey] = useState('');

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivKey(e.currentTarget.value);

  const handleAccept = () => {
    return onAccept({ walletType: WalletType.PRIVATE_KEY, privateKey: privKey });
  };

  return (
    <>
      {currentAccount && !currentAccount.persistent && (
        <>
          <label htmlFor="privkey">{translateRaw('PRIVATE_KEY')}</label>
          <br />
          <input id="privkey" name="privkey" type="text" onChange={changePrivateKey} />
          <br />
        </>
      )}
      <SignBottom
        disabled={privKey.length === 0 && !currentAccount.persistent}
        handleAccept={handleAccept}
        handleDeny={onDeny}
      />
    </>
  );
};
