import React, { useEffect, useState } from 'react';

import { JsonRPCRequest } from '@types';
import { makeTx } from '@utils';
import { ipcBridge } from '@bridge';
import { signWithPrivateKey } from '../signing';

export const Home = () => {
  const [tx, setTx] = useState<JsonRPCRequest | undefined>(undefined);
  const [privKey, setPrivKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    ipcBridge.subscribe('message', (event) => {
      // We expect this to be validated and sanitized JSON RPC request
      setTx(event);
      console.debug(event);
    });
  }, []);

  const handleDeny = async () => {
    if (tx) {
      ipcBridge.send('message', {
        id: tx.id,
        error: { code: '-32000', message: 'User denied transaction' },
      });
      setTx(undefined);
      setError('');
    }
  };

  const handleAccept = async () => {
    if (privKey.length > 0 && tx) {
      try {
        const formattedTx = makeTx(tx);
        const signed = await signWithPrivateKey(privKey, formattedTx);
        ipcBridge.send('message', { id: tx.id, result: signed });
        setTx(undefined);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {tx ? <pre>{JSON.stringify(tx, null, 2)}</pre> : 'Nothing to sign'}
      <br />
      <label htmlFor="privkey">
        Private Key
        <input
          id="privkey"
          name="privkey"
          type="text"
          onChange={(e) => setPrivKey(e.currentTarget.value)}
        />
      </label>
      <br />
      <button type="button" disabled={!tx} onClick={handleDeny}>
        Deny
      </button>
      <button
        type="button"
        disabled={!tx || privKey.length === 0}
        onClick={handleAccept}
      >
        Accept
      </button>
      <br />
      {error}
    </div>
  );
};
