import { Body } from '@mycrypto/ui';
import { push } from 'connected-react-router';

import {
  Box,
  FromToAccount,
  ScrollableContainer,
  TimeElapsed,
  TransactionBottom,
  TxDetails,
  TxInfoBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  getTransactionInfoBannerType,
  sign
} from '@common/store';
import { translateRaw } from '@common/translate';
import { TxResult } from '@types';

export const Transaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const currentTx = useSelector(getCurrentTransaction);
  const { tx, timestamp, result, origin } = currentTx;
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);
  const info = useSelector(getTransactionInfoBannerType);

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
          <TxInfoBanner type={info} />
          <FromToAccount
            sender={{ address: tx.from, label: currentAccount?.label }}
            recipient={tx.to && { address: tx.to, label: recipientAccount?.label }}
          />
          <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
            {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
            <TimeElapsed value={timestamp} />
          </Body>
          <TxDetails tx={currentTx} />
        </Box>
      </ScrollableContainer>
      {result === TxResult.WAITING && (
        <TransactionBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
