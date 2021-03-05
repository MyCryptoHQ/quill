import React from 'react';

import { Box, Image } from '@app/components';
import circleArrow from '@assets/icons/circle-arrow.svg';
import approved from '@assets/icons/queue-approved.svg';
import denied from '@assets/icons/queue-denied.svg';
import { TxHistoryEntry, TxHistoryResult } from '@types';

import { TimeElapsed } from '../Core';
import { Body } from '../Typography';

export const TxHistoryCard = ({ item }: { item: TxHistoryEntry }) => {
  const isApproved = item.result === TxHistoryResult.APPROVED;
  return (
    <Box variant="rowAlign" py="16px">
      <Image height="20px" width="20px" src={isApproved ? approved : denied} mr="8px" />
      <Body color={isApproved ? 'GREEN' : 'BLUE_GREY'}>{item.result}</Body>
      <Box ml="auto" variant="rowAlign">
        <Body
          fontSize="1"
          pr="14px"
          color="BLUE_GREY"
          sx={{ textDecoration: isApproved ? 'none' : 'line-through' }}
        >
          <TimeElapsed value={item.timestamp} />
        </Body>
        <Image height="20px" width="20px" src={circleArrow} />
      </Box>
    </Box>
  );
};
