import React from 'react';

import { push } from 'connected-react-router';

import {
  Body,
  Box,
  Container,
  FromToAccount,
  SignBottom,
  TimeElapsed,
  TxDetails,
  TxResultBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  sign,
  useDispatch,
  useSelector
} from '@app/store';
import { translateRaw } from '@translations';
import { TxResult } from '@types';

export const Transaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, timestamp, result, origin } = useSelector(getCurrentTransaction);
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);

  const handleAccept = () => {
    if (currentAccount.persistent) {
      dispatch(
        sign({
          wallet: {
            persistent: true,
            uuid: currentAccount.uuid
          },
          tx
        })
      );
    } else {
      dispatch(push(ROUTE_PATHS.SIGN_TX));
    }
  };

  const handleDeny = () => {
    dispatch(denyCurrentTransaction());
  };

  return (
    <>
      <Container>
        <Box>
          <TxResultBanner result={result} />
          <FromToAccount sender={tx.from} recipient={tx.to} />
          <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
            {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
            <TimeElapsed value={timestamp} />
          </Body>
          <TxDetails tx={tx} />
        </Box>
      </Container>
      {result === TxResult.WAITING && (
        <SignBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
