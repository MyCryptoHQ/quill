import React from 'react';

import { Box, BoxProps } from '@app/components';
import { translateRaw } from '@translations';
import { TAddress } from '@types';

import { Account } from './Account';

// @todo Handle labels
export const FromToAccount = ({
  sender,
  recipient,
  ...props
}: { sender: TAddress; recipient: TAddress } & BoxProps) => (
  <Box variant="rowAlign" {...props}>
    <Box mr="1">
      {translateRaw('SENDER')}
      <Account address={sender} truncate={true} pr="4" />
    </Box>
    <Box ml="1">
      {translateRaw('RECIPIENT')}
      <Account address={recipient} truncate={true} pr="4" />
    </Box>
  </Box>
);
