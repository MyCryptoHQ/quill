import React, { useEffect } from 'react';

import { ROUTE_PATHS } from '@routing';
import { push } from 'connected-react-router';
import { useSelector } from 'react-redux';

import { Body, Box, Image, TxHistory, TxQueue } from '@app/components';
import info from '@assets/icons/circle-info.svg';
import { getAccountsLength, getQueue, getTxHistory, useDispatch } from '@store';
import { translateRaw } from '@translations';

export const Home = () => {
  const dispatch = useDispatch();
  const accountsLength = useSelector(getAccountsLength);
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);

  useEffect(() => {
    if (accountsLength === 0) {
      dispatch(push(ROUTE_PATHS.SETUP_ACCOUNT));
    }
  }, [accountsLength]);

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
