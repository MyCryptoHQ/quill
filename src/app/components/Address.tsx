import React from 'react';

import { Blockie, Body, Flex, FlexProps } from '@components';
import { TAddress } from '@types';

interface Props {
  address: TAddress;
}

export const Address = ({ address, ...props }: Props & Omit<FlexProps, 'variant'>) => (
  <Flex variant="rowAlign" {...props}>
    <Blockie address={address} width="30px" minWidth="30px" height="30px" mr="3" />
    <Body
      fontSize="14px"
      sx={{
        wordBreak: 'break-word'
      }}
    >
      {address}
    </Body>
  </Flex>
);
