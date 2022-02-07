import { Body } from '@mycrypto/ui';
import {
  getAccountsLength,
  getPersisted,
  getQueue,
  getTxHistory,
  translateRaw
} from '@quill/common';
import { push } from 'connected-react-router';
import { useEffect } from 'react';

import {
  Box,
  Heading3,
  Image,
  ScrollableContainer,
  TxHistory,
  TxHistoryStats
} from '@app/components';
import { translate } from '@app/translations';
import wallet from '@assets/icons/home.svg';
import { ROUTE_PATHS } from '@routing';
import { useDispatch, useSelector } from '@store';

export const Home = () => {
  const dispatch = useDispatch();
  const accountsLength = useSelector(getAccountsLength);
  const queue = useSelector(getQueue);
  const txHistory = useSelector(getTxHistory);
  const isPersisted = useSelector(getPersisted);

  useEffect(() => {
    if (isPersisted && accountsLength === 0) {
      dispatch(push(ROUTE_PATHS.SETUP_ACCOUNT));
    }
  }, [isPersisted]);

  return (
    <ScrollableContainer>
      <Box sx={{ textAlign: 'center' }}>
        <Image alt="Wallet" src={wallet} />
      </Box>
      <TxHistoryStats />
      {queue.length > 0 || txHistory.length > 0 ? (
        <TxHistory />
      ) : (
        <Box mt="5" maxWidth="80%" mx="auto" sx={{ textAlign: 'center' }}>
          <Heading3 mt="3" mb="2">
            {translateRaw('HOME_EMPTY_HEADER')}
          </Heading3>
          <Body>{translate('HOME_EMPTY_SUBHEADING')}</Body>
        </Box>
      )}
    </ScrollableContainer>
  );
};
