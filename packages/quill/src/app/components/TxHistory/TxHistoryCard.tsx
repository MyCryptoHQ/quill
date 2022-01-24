import { Body } from '@mycrypto/ui';
import { selectTransaction, translateRaw, TxResult } from '@quill/common';
import type { TxHistoryEntry } from '@quill/common';

import { Box, Image } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useDispatch } from '@app/store';
import approved from '@assets/icons/circle-checkmark.svg';
import denied from '@assets/icons/queue-denied.svg';
import squareArrow from '@assets/icons/square-arrow.svg';

import { LinkApp, TimeElapsed } from '../Core';

export const TxHistoryCard = ({ item }: { item: TxHistoryEntry }) => {
  const dispatch = useDispatch();
  const { origin, result } = item;
  const isApproved = result === TxResult.APPROVED;
  const handleSelect = () => dispatch(selectTransaction(item));

  return (
    <Box variant="horizontal-start" p="3" data-testid={isApproved ? 'approved-tx' : 'denied-tx'}>
      <Image height="20px" width="20px" src={isApproved ? approved : denied} mr="8px" />
      <Body fontSize="1" fontWeight="bold" color="BLUE_GREY">
        {result}
      </Body>
      <Box ml="auto" variant="horizontal-start">
        <Body
          fontSize="1"
          pr="14px"
          color="BLUE_GREY"
          sx={{ textDecoration: isApproved ? 'none' : 'line-through' }}
        >
          {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
          <TimeElapsed value={item.receivedTimestamp} />
        </Body>
        <LinkApp href={ROUTE_PATHS.TX} data-testid={`select-tx-history`} onClick={handleSelect}>
          <Box variant="horizontal-start">
            <Image height="24px" width="24px" src={squareArrow} />
          </Box>
        </LinkApp>
      </Box>
    </Box>
  );
};
