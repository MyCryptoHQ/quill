import { useEffect, useState } from 'react';
import { Persistor } from 'redux-persist';

export const usePersisted = (persistor: Persistor): boolean => {
  const [isPersisted, setPersisted] = useState(false);

  const handleChange = () => {
    const { bootstrapped } = persistor.getState();
    setPersisted(bootstrapped);
  };

  useEffect(() => {
    return persistor.subscribe(handleChange);
  }, []);

  return isPersisted;
};
