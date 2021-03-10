import React from 'react';

import { Body, Box, FromToAccount, SignBottom, TimeElapsed, TxDetails, TxResultBanner } from '@app/components';
import { getCurrentTransaction, useSelector } from '@app/store';

export const Transaction = () => {
  const { tx, timestamp, result } = useSelector(getCurrentTransaction);
  return (
    <>
      <Box mb="170px">
        <TxResultBanner result={result} />
        <FromToAccount sender={tx.from} recipient={tx.to} />
        <Body fontSize="1" color="BLUE_GREY" mb="3">
          <TimeElapsed value={timestamp} />
        </Body>
        <TxDetails tx={tx} />
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Box>
      <SignBottom />
    </>
  );
};
