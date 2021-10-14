import { Body } from '@mycrypto/ui';
import {
  denyCurrentTransaction,
  getAccounts,
  getCurrentTransaction,
  getTransactionInfoBannerType,
  sign,
  translateRaw,
  TxResult
} from '@quill/common';
import { push } from 'connected-react-router';

import {
  Box,
  FromToAccount,
  LinkApp,
  ScrollableContainer,
  TimeElapsed,
  TransactionBottom,
  TxDetails,
  TxInfoBanner
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';

export const Transaction = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);
  const currentTx = useSelector(getCurrentTransaction);
  const { tx, receivedTimestamp, result, origin } = currentTx;
  const currentAccount = tx && accounts.find((a) => a.address === tx.from);
  const recipientAccount = tx && accounts.find((a) => a.address === tx.to);
  const info = useSelector(getTransactionInfoBannerType);

  const handleAccept = () => {
    if (currentAccount?.persistent) {
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
          <Box variant="horizontal-start">
            <Body fontSize="14px" color="BLUE_GREY" mb="2" mt="2">
              {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
              <TimeElapsed value={receivedTimestamp} />
            </Body>
          </Box>
          <TxDetails tx={currentTx} />
          <Box mt="2" sx={{ textAlign: 'right' }}>
            {result === TxResult.WAITING && (
              <LinkApp href={ROUTE_PATHS.EDIT_TX} mr="1" height="20px" width="20px">
                {translateRaw('EDIT_TRANSACTION_DETAILS')}
              </LinkApp>
            )}
          </Box>
        </Box>
      </ScrollableContainer>
      {result === TxResult.WAITING && (
        <TransactionBottom disabled={false} handleAccept={handleAccept} handleDeny={handleDeny} />
      )}
    </>
  );
};
