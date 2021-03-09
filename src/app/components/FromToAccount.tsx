import React from 'react';

import { Box, BoxProps } from '@app/components';
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
      Sender
      <Account address={sender} truncate={true} pr="4" />
    </Box>
    <Box ml="1">
      Recipient
      <Account address={recipient} truncate={true} pr="4" />
    </Box>
  </Box>
);
