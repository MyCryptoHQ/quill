import React, { useEffect, useState } from 'react';

import { ipcBridge } from '@bridge';

import { JsonRPCRequest } from '@types';
import { makeTx } from '@utils';

import { signWithPrivateKey } from '../signing';
import { useQueue } from '../utils';

export const Home = () => {
  const { first: tx, length, enqueue, dequeue } = useQueue<JsonRPCRequest>();
  const [privKey, setPrivKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    ipcBridge.subscribe('message', (event) => {
      // We expect this to be validated and sanitized JSON RPC request
      enqueue(event);
      console.debug(event);
    });
  }, []);

  const handleDeny = async () => {
    if (tx) {
      ipcBridge.send('message', {
        id: tx.id,
        error: { code: '-32000', message: 'User denied transaction' }
      });
      dequeue();
      setError('');
    }
  };

  const handleAccept = async () => {
    if (privKey.length > 0 && tx) {
      try {
        const formattedTx = makeTx(tx);
        const signed = await signWithPrivateKey(privKey, formattedTx);
        ipcBridge.send('message', { id: tx.id, result: signed });
        dequeue();
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      {length > 1 && (
        <>
          {`TXs in queue: ${length}`}
          <br />
        </>
      )}
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
      <button type="button" disabled={!tx || privKey.length === 0} onClick={handleAccept}>
        Accept
      </button>
      <br />
      {error}
    </div>
  );
};
