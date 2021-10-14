import { formatTimeDifference } from '@quill/common';
import { useState } from 'react';

import { useInterval } from '@app/hooks';

const TimeElapsed = ({ value }: { value: number }) => {
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
