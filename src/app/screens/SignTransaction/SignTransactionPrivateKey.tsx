import React, { useState } from 'react';

import { SignTransactionProps } from '@types';

export const SignTransactionPrivateKey = ({
  onAccept,
  onDeny,
  hasPersistentPrivateKey,
  currentAccount,
  tx
}: SignTransactionProps) => {
  const [privKey, setPrivKey] = useState('');

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivKey(e.currentTarget.value);

  const handleAccept = () => {
    onAccept(privKey);
  };

  return (
    <>
      {currentAccount && !hasPersistentPrivateKey && (
        <>
          <label htmlFor="privkey">Private Key</label>
          <br />
          <input id="privkey" name="privkey" type="text" onChange={changePrivateKey} />
          <br />
        </>
      )}
      <button id="deny_button" type="button" disabled={!tx} onClick={onDeny}>
        Deny
      </button>
      <button
        id="accept_button"
        type="button"
        disabled={!tx || (privKey.length === 0 && !hasPersistentPrivateKey)}
        onClick={handleAccept}
      >
        Accept
      </button>
    </>
  );
};
