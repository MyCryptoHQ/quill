import { formatEther } from '@ethersproject/units';
import { Banner, Body } from '@mycrypto/ui';
import { getAccounts, selectTransaction, translateRaw } from '@quill/common';
import type { TxQueueEntry } from '@quill/common';

import { Box, FromToAccount, Image, LinkApp, TimeElapsed } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import squareArrow from '@assets/icons/square-arrow-filled.svg';
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
    <Box
      mt={first ? '0' : '16px'}
      p="2"
      sx={{ boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)', borderRadius: '3px' }}
    >
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
            <Image height="24px" width="24px" src={squareArrow} />
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
