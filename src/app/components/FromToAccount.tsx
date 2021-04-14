import React from 'react';

import { Box, BoxProps } from '@app/components';
import { translateRaw } from '@common/translate';
import { IAccount } from '@types';

import { Account } from './Account';

type AccountLabel = Pick<IAccount, 'address' | 'label'>;

export const FromToAccount = ({
  sender,
  recipient,
  ...props
}: { sender: AccountLabel; recipient: AccountLabel } & BoxProps) => (
  <Box variant="rowAlign" {...props}>
    <Box mr="1">
      {translateRaw('SENDER')}
      <Account address={sender.address} label={sender.label} truncate={true} pr="4" />
    </Box>
    <Box ml="1">
      {translateRaw('RECIPIENT')}
      <Account address={recipient.address} label={recipient.label} truncate={true} pr="4" />
    </Box>
  </Box>
);
