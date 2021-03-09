import React from 'react';

import { getQueue, getTxHistory } from '@store/transactions.slice';
import { useSelector } from 'react-redux';

import { Body, Box, Image, TxHistory, TxQueue } from '@app/components';
import info from '@assets/icons/circle-info.svg';

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
              There are no transactions in your Signer at this time
            </Body>
            <Body color="BLUE_GREY">
              Initiate a transaction from MyCrypto.com to see it appear here
            </Body>
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
