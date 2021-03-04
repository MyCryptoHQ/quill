import React from 'react';

import { Box, Image } from '@app/components';
import circleArrow from '@assets/icons/circle-arrow.svg';
import approved from '@assets/icons/queue-approved.svg';
import denied from '@assets/icons/queue-denied.svg';
import { TxHistoryEntry, TxHistoryResult } from '@types';

import { Body } from '../Typography';

export const TxHistoryCard = ({ item }: { item: TxHistoryEntry }) => {
  const isApproved = item.result === TxHistoryResult.APPROVED;
  return (
    <Box variant="rowAlign" py="16px">
      <Image height="20px" width="20px" src={isApproved ? approved : denied} mr="8px" />
      <Body color={isApproved ? 'GREEN' : 'BLUE_GREY'}>{item.result}</Body>
      <Image height="20px" width="20px" src={circleArrow} ml="auto" />
    </Box>
  );
};
