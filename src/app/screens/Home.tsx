import React from 'react';

import { getQueue, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { Body, Box, Image, TxHistory, TxQueue } from '@app/components';
import info from '@assets/icons/circle-info.svg';
import { translateRaw } from '@translations';

export const Home = () => {
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);

  return (
    <>
      {queue.length === 0 && txHistory.length === 0 ? (
        <Box variant="rowCenter" height="100%">
          <Box variant="columnAlign" sx={{ textAlign: 'center' }}>
            <Image src={info} height="52px" width="52px" />
            <Body color="BLUE_DARK_SLATE" fontWeight="bold">
              {translateRaw('HOME_EMPTY_HEADER')}
            </Body>
            <Body color="BLUE_GREY">{translateRaw('HOME_EMPTY_SUBHEADING')}</Body>
          </Box>
        </Box>
      ) : (
        <>
          <TxQueue queue={queue} />
          <TxHistory history={txHistory} />
        </>
      )}
    </>
  );
};
