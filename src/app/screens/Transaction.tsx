import React from 'react';

import { Body, FromToAccount, TimeElapsed, TxDetails, TxResultBanner } from '@app/components';
import { getCurrentTransaction, useSelector } from '@app/store';

import { SignTransaction } from './SignTransaction';

export const Transaction = () => {
  const { tx, timestamp, result } = useSelector(getCurrentTransaction);
  return (
    <>
      <TxResultBanner result={result} />
      <FromToAccount sender={tx.from} recipient={tx.to} />
      <Body fontSize="1" color="BLUE_GREY" mb="3">
        <TimeElapsed value={timestamp} />
      </Body>
      <TxDetails tx={tx} />
      <SignTransaction />
    </>
  );
};
