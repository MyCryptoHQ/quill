import React, { useEffect, useState } from "react";
import { signWithPrivateKey } from "@api/signing";
import appRuntime from "../appRuntime";
import { JsonRPCRequest } from "../types/JsonRPCRequest";
import { makeTx } from "../api/util";

export const Home = () => {
  const [tx, setTx] = useState<JsonRPCRequest | undefined>(undefined);
  const [privKey, setPrivKey] = useState<string | undefined>(undefined);

  useEffect(() => {
    appRuntime.subscribe("message", (event) => {
      // We expect this to be validated and sanitized JSON RPC request
      setTx(event);
      console.debug(event);
    });
  }, []);

  const handleSign = async () => {
    if (privKey && tx) {
      const formattedTx = makeTx(tx)
      const signed = await signWithPrivateKey(privKey, formattedTx);
      appRuntime.send("message", signed);
      setTx(undefined)
    }
  };

  return (
    <div>
      {tx ? JSON.stringify(tx) : "Nothing to sign"}
      <br />
      <input type="text" onChange={(e) => setPrivKey(e.currentTarget.value)} />
      <br />
      <button onClick={handleSign}>Sign</button>
    </div>
  );
};
