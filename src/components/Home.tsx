import React, { useEffect } from "react";
import appRuntime from "../appRuntime";

export const Home = () => {
  useEffect(() => {
    appRuntime.subscribe("message", (event) => {
      console.debug(event);
    });
  });
  return <div>HELLO WORLD</div>;
};
