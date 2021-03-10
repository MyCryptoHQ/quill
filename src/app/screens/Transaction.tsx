import React from 'react';

import { useHistory } from 'react-router-dom';

import {
  Body,
  Box,
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
import { TxResult } from '@types';

export const Transaction = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, timestamp, result } = useSelector(getCurrentTransaction);
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
      history.push(ROUTE_PATHS.SIGN_TX);
    }
  };

  const handleDeny = () => {
    dispatch(denyCurrentTransaction());
  };

  return (
    <>
      <Box mb="170px">
        <TxResultBanner result={result} />
        <FromToAccount sender={tx.from} recipient={tx.to} />
        <Body fontSize="1" color="BLUE_GREY" mb="3">
          <TimeElapsed value={timestamp} />
        </Body>
        <TxDetails tx={tx} />
      </Box>
      {result === TxResult.WAITING && (
        <SignBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
