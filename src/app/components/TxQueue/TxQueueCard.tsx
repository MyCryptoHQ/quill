import React from 'react';

import { TransactionRequest } from '@ethersproject/abstract-provider';
import { formatEther } from '@ethersproject/units';

import { Body, Box, Image } from '@app/components';
import circleArrow from '@assets/icons/circle-arrow.svg';
import waiting from '@assets/icons/queue-waiting.svg';

export const TxQueueCard = ({ item }: { item: TransactionRequest }) => (
  <Box py="16px">
    <Box variant="rowAlign">
      <Image src={waiting} height="20px" width="20px" mr="8px" />
      <Body color="PURPLE">WAITING ON ACTION</Body>
    </Box>
    <Box variant="rowAlign">
      Sender Recipient
      <Image height="20px" width="20px" src={circleArrow} ml="auto" />
    </Box>
    <Box>
      <Body fontWeight="bold">{formatEther(item.value)} ETH</Body>
    </Box>
  </Box>
);
