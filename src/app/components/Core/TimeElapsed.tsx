import React, { useState } from 'react';

import { formatDistanceToNow } from 'date-fns';

import { useInterval } from '@app/hooks';

const TimeElapsed = ({ value }: { value: number }) => {
  const formatTimeDifference = (val: number) =>
    formatDistanceToNow(val, { addSuffix: true, includeSeconds: true });

  const [timeElapsed, setTimeElapsed] = useState(formatTimeDifference(value));

  useInterval(
    () => {
      setTimeElapsed(formatTimeDifference(value));
    },
    1000,
    true,
    [value]
  );

  return <>{timeElapsed}</>;
};

export default TimeElapsed;
