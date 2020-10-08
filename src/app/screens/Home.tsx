import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '@app/routes';
import { signWithPrivateKey, useApiService } from '@app/services';
import { useSelector } from '@app/store';
import { makeTx } from '@utils';

export const Home = () => {
  const { approveCurrent, denyCurrent, currentTx, txQueueLength } = useApiService();
  const [privKey, setPrivKey] = useState('');
  const [error, setError] = useState('');

  const accounts = useSelector((state) => state.accounts);

  const handleDeny = async () => {
    if (currentTx) {
      denyCurrent();
      setError('');
    }
  };

  const handleAccept = async () => {
    if (privKey.length > 0 && currentTx) {
      try {
        const formattedTx = makeTx(currentTx);
        const signed = await signWithPrivateKey(privKey, formattedTx);
        approveCurrent(signed);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivKey(e.currentTarget.value);

  return (
    <div>
      {JSON.stringify(accounts)}
      <Link to={ROUTES.ADD_ACCOUNT.path}>+</Link>
      <br />
      {txQueueLength > 1 && (
        <>
          {`TXs in queue: ${txQueueLength}`}
          <br />
        </>
      )}
      {currentTx ? <pre>{JSON.stringify(currentTx, null, 2)}</pre> : 'Nothing to sign'}
      <br />
      <label htmlFor="privkey">Private Key</label>
      <br />
      <input id="privkey" name="privkey" type="text" onChange={changePrivateKey} />

      <br />
      <button id="deny_button" type="button" disabled={!currentTx} onClick={handleDeny}>
        Deny
      </button>
      <button
        id="accept_button"
        type="button"
        disabled={!currentTx || privKey.length === 0}
        onClick={handleAccept}
      >
        Accept
      </button>
      <br />
      {error}
    </div>
  );
};
