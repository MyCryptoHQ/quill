import React from 'react';

import approved from '@assets/icons/queue-approved.svg';
import denied from '@assets/icons/queue-denied.svg';
import waiting from '@assets/icons/queue-waiting.svg';
import { TxResult } from '@types';

import { Box, Image } from '.';
import { Body } from './Typography';

const configs = {
  [TxResult.WAITING]: {
    bg: 'rgba(166, 130, 255, 0.15)',
    color: 'PURPLE',
    icon: waiting,
    label: 'This transaction is waiting on action'
  },
  [TxResult.DENIED]: {
    bg: 'rgba(181, 191, 199, 0.15)',
    color: 'BLUE_GREY',
    icon: denied,
    label: 'This transaction has been denied'
  },
  [TxResult.APPROVED]: {
    bg: 'rgba(179, 221, 135, 0.15)',
    color: 'GREEN',
    icon: approved,
    label: 'This transaction has been approved'
  }
};

export const TxResultBanner = ({ result }: { result: TxResult }) => {
  const { bg, color, icon, label } = configs[result];
  return (
    <Box bg={bg} sx={{ borderRadius: '3px' }} variant="rowAlign" p="2" my="2">
      <Image src={icon} height="20px" width="20px" mr="2" />
      <Body color={color} fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Body>
    </Box>
  );
};
