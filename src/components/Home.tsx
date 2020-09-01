import React, { useEffect, useState } from "react";
import appRuntime from "../appRuntime";

export const Home = () => {
  const [state, setState] = useState(undefined);

  useEffect(() => {
    appRuntime.subscribe("message", (event) => {
      setState(event);
      console.debug(event);
    });
  });
  return (
    <div>
      {state ? state : "Nothing to sign"}
      <button onClick={() => appRuntime.send("message", "sign")}>Sign</button>
    </div>
  );
};
