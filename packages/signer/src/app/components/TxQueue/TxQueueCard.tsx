import { formatEther } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';
import { getAccounts, selectTransaction, translateRaw } from '@signer/common';
import type { TxQueueEntry } from '@signer/common';

import { Banner, Box, FromToAccount, Image, LinkApp, TimeElapsed } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import circleArrow from '@assets/icons/circle-arrow.svg';
import { getChain } from '@data';

export const TxQueueCard = ({ item, first }: { item: TxQueueEntry; first: boolean }) => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);

  const { tx, origin } = item;

  const chain = getChain(tx.chainId);
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const currentAccount = accounts.find((a) => a.address === tx.from);
  const recipientAccount = accounts.find((a) => a.address === tx.to);

  const handleSelect = () => dispatch(selectTransaction(item));

  return (
    <Box pt={first ? '0' : '16px'} pb="16px">
      <Banner
        type="clear"
        label={translateRaw('HOME_TX_RESULT_WAITING')}
        badge={first && translateRaw('NEW')}
      />
      <Box variant="horizontal-start" mt="2">
        <FromToAccount
          sender={{ address: tx.from, label: currentAccount?.label }}
          recipient={tx.to && { address: tx.to, label: recipientAccount?.label }}
          nonce={tx.nonce}
        />
        <LinkApp
          href={ROUTE_PATHS.TX}
          ml="auto"
          data-testid={`select-tx-${item.id}`}
          onClick={handleSelect}
        >
          <Box variant="horizontal-start">
            <Image height="20px" width="20px" src={circleArrow} />
          </Box>
        </LinkApp>
      </Box>
      <Box variant="horizontal-start" mt="1">
        <Body fontSize="1" fontWeight="bold">
          {formatEther(tx.value)} {symbol}
        </Body>
        <Body fontSize="1" ml="1" color="BLUE_GREY">
          {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
          <TimeElapsed value={item.receivedTimestamp} />
        </Body>
      </Box>
    </Box>
  );
};
