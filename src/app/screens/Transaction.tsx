import { Body } from '@mycrypto/ui';
import { push } from 'connected-react-router';

import {
  Box,
  FromToAccount,
  ScrollableContainer,
  TimeElapsed,
  TransactionBottom,
  TxDetails,
  TxResultBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import { denyCurrentTransaction, getAccounts, getCurrentTransaction, sign } from '@common/store';
import { translateRaw } from '@common/translate';
import { TxResult } from '@types';

export const Transaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const { tx, timestamp, result, origin } = useSelector(getCurrentTransaction);
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);

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
      <ScrollableContainer>
        <Box>
          <TxResultBanner result={result} />
          <FromToAccount
            sender={{ address: tx.from, label: currentAccount?.label }}
            recipient={tx.to && { address: tx.to, label: recipientAccount?.label }}
            nonce={tx.nonce}
          />
          <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
            {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
            <TimeElapsed value={timestamp} />
          </Body>
          <TxDetails tx={tx} />
        </Box>
      </ScrollableContainer>
      {result === TxResult.WAITING && (
        <TransactionBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
