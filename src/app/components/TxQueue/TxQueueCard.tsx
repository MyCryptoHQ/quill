import React from 'react';

import { formatEther } from '@ethersproject/units';

import { Body, Box, FromToAccount, Image, LinkApp, TimeElapsed } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { selectTransaction, useDispatch } from '@app/store';
import circleArrow from '@assets/icons/circle-arrow.svg';
import waiting from '@assets/icons/queue-waiting.svg';
import { JsonRPCRequest, TAddress, TSignTransaction } from '@types';
import { makeTx } from '@utils';

export const TxQueueCard = ({ item }: { item: JsonRPCRequest<TSignTransaction> }) => {
  const dispatch = useDispatch();

  const tx = makeTx(item);

  return (
    <Box py="16px">
      <Box variant="rowAlign">
        <Image src={waiting} height="20px" width="20px" mr="8px" />
        <Body color="PURPLE">WAITING ON ACTION</Body>
      </Box>
      <Box variant="rowAlign" mt="2">
        <FromToAccount sender={tx.from as TAddress} recipient={tx.to as TAddress} />
        <LinkApp href={ROUTE_PATHS.TX} ml="auto" onClick={() => dispatch(selectTransaction(item))}>
          <Image height="20px" width="20px" src={circleArrow} />
        </LinkApp>
      </Box>
      <Box variant="rowAlign" mt="1">
        <Body fontSize="1" fontWeight="bold">
          {formatEther(tx.value)} ETH
        </Body>
        <Body fontSize="1" ml="1" color="BLUE_GREY">
          <TimeElapsed value={0} />
        </Body>
      </Box>
    </Box>
  );
};
