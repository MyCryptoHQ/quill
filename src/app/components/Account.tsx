import React from 'react';

import { Blockie, Body } from '@mycrypto/ui';

import { Box, BoxProps } from '@app/components';
import { translateRaw } from '@common/translate';
import { TAddress } from '@types';
import { truncate } from '@utils';

export const Account = ({
  label,
  address,
  truncate: shouldTruncate,
  addressColor,
  ...props
}: { address: TAddress; label?: string; truncate: boolean; addressColor?: string } & BoxProps) => (
  <Box bg="GREY_LIGHTEST" p="10px" variant="rowAlign" {...props}>
    <Blockie height="32px" width="32px" minWidth="32px" address={address} />
    <Box pl="1">
      <Body fontSize="3">{label ?? translateRaw('NO_LABEL')}</Body>
      <Body sx={{ overflow: 'hidden', textOverflow: 'ellipsis', color: addressColor }}>
        {shouldTruncate ? truncate(address) : address}
      </Body>
    </Box>
  </Box>
);
