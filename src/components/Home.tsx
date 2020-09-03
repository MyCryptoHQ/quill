import React, { useEffect, useState } from 'react';
import { signWithPrivateKey } from '@api/signing';
import appRuntime from '../appRuntime';
import { JsonRPCRequest } from '../types/JsonRPCRequest';
import { makeTx } from '../api/util';

export const Home = () => {
  const [tx, setTx] = useState<JsonRPCRequest | undefined>(undefined);
  const [privKey, setPrivKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    appRuntime.subscribe('message', (event) => {
      // We expect this to be validated and sanitized JSON RPC request
      setTx(event);
      console.debug(event);
    });
  }, []);

  const handleDeny = async () => {
    if (tx) {
      appRuntime.send('message', {
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
        appRuntime.send('message', { id: tx.id, result: signed });
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
