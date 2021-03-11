import React from 'react';

import { Box, BoxProps } from '@app/components';
import { translateRaw } from '@translations';
import { TAddress } from '@types';
import { truncate } from '@utils';

import { Blockie } from './Blockie';
import { Body } from './Typography';

export const Account = ({
  label,
  address,
  truncate: shouldTruncate,
  ...props
}: { address: TAddress; label?: string; truncate: boolean } & BoxProps) => (
  <Box bg="GREY_LIGHTEST" p="10px" variant="rowAlign" {...props}>
    <Blockie height="32px" width="32px" address={address} />
    <Box pl="1">
      <Body fontSize="3">{label ? label : translateRaw('NO_LABEL')}</Body>
      <Body>{shouldTruncate ? truncate(address) : address}</Body>
    </Box>
  </Box>
);
