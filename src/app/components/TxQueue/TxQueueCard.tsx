import React from 'react';

import { formatEther } from '@ethersproject/units';

import { Body, Box, FromToAccount, Image, LinkApp, TimeElapsed } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { getAccounts, selectTransaction, useDispatch, useSelector } from '@app/store';
import circleArrow from '@assets/icons/circle-arrow.svg';
import waiting from '@assets/icons/queue-waiting.svg';
import { translateRaw } from '@common/translate';
import { getChain } from '@data';
import { TxQueueEntry } from '@types';

export const TxQueueCard = ({ item }: { item: TxQueueEntry }) => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, origin } = item;
  const currentAccount = accounts.find((a) => a.address === tx.from);
  const recipientAccount = accounts.find((a) => a.address === tx.to);
  const handleSelect = () => dispatch(selectTransaction(item));
  const chain = getChain(tx.chainId);
  const symbol = chain?.nativeCurrency?.symbol ?? '?';

  return (
    <Box pb="16px">
      <Box variant="rowAlign">
        <Image src={waiting} height="20px" width="20px" mr="8px" />
        <Body color="PURPLE" sx={{ textTransform: 'uppercase' }}>
          {translateRaw('HOME_TX_RESULT_WAITING')}
        </Body>
      </Box>
      <Box variant="rowAlign" mt="2">
        <FromToAccount
          sender={{ address: tx.from, label: currentAccount?.label }}
          recipient={{ address: tx.to, label: recipientAccount?.label }}
        />
        <LinkApp
          href={ROUTE_PATHS.TX}
          ml="auto"
          data-testid={`select-tx-${item.id}`}
          onClick={handleSelect}
        >
          <Box variant="rowAlign">
            <Image height="20px" width="20px" src={circleArrow} />
          </Box>
        </LinkApp>
      </Box>
      <Box variant="rowAlign" mt="1">
        <Body fontSize="1" fontWeight="bold">
          {formatEther(tx.value)} {symbol}
        </Body>
        <Body fontSize="1" ml="1" color="BLUE_GREY">
          {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
          <TimeElapsed value={item.timestamp} />
        </Body>
      </Box>
    </Box>
  );
};
