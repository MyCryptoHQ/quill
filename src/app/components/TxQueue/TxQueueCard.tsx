import React from 'react';

import { TransactionRequest } from '@ethersproject/abstract-provider';
import { formatEther } from '@ethersproject/units';

import { Body, Box, FromToAccount, Image, TimeElapsed } from '@app/components';
import circleArrow from '@assets/icons/circle-arrow.svg';
import waiting from '@assets/icons/queue-waiting.svg';
import { TAddress } from '@types';

export const TxQueueCard = ({ item }: { item: TransactionRequest }) => (
  <Box py="16px">
    <Box variant="rowAlign">
      <Image src={waiting} height="20px" width="20px" mr="8px" />
      <Body color="PURPLE">WAITING ON ACTION</Body>
    </Box>
    <Box variant="rowAlign" mt="2">
      <FromToAccount sender={item.from as TAddress} recipient={item.to as TAddress} />
      <Image height="20px" width="20px" src={circleArrow} ml="auto" />
    </Box>
    <Box variant="rowAlign" mt="1">
      <Body fontSize="1" fontWeight="bold">
        {formatEther(item.value)} ETH
      </Body>
      <Body fontSize="1" ml="1" color="BLUE_GREY">
        <TimeElapsed value={0} />
      </Body>
    </Box>
  </Box>
);
