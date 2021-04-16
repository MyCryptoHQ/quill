import { Body } from '@mycrypto/ui';

import { Box, Image } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { selectTransaction, useDispatch } from '@app/store';
import circleArrow from '@assets/icons/circle-arrow.svg';
import approved from '@assets/icons/circle-checkmark.svg';
import denied from '@assets/icons/queue-denied.svg';
import { translateRaw } from '@common/translate';
import { TxHistoryEntry, TxResult } from '@types';

import { LinkApp, TimeElapsed } from '../Core';

export const TxHistoryCard = ({ item }: { item: TxHistoryEntry }) => {
  const dispatch = useDispatch();
  const { origin, result } = item;
  const isApproved = result === TxResult.APPROVED;
  const handleSelect = () => dispatch(selectTransaction(item));

  return (
    <Box variant="horizontal-start" py="16px">
      <Image height="20px" width="20px" src={isApproved ? approved : denied} mr="8px" />
      <Body color={isApproved ? 'GREEN' : 'BLUE_GREY'}>{result}</Body>
      <Box ml="auto" variant="horizontal-start">
        <Body
          fontSize="1"
          pr="14px"
          color="BLUE_GREY"
          sx={{ textDecoration: isApproved ? 'none' : 'line-through' }}
        >
          {translateRaw('REQUEST_ORIGIN', { $origin: origin ?? translateRaw('UNKNOWN') })}{' '}
          <TimeElapsed value={item.timestamp} />
        </Body>
        <LinkApp href={ROUTE_PATHS.TX} data-testid={`select-tx-history`} onClick={handleSelect}>
          <Box variant="horizontal-start">
            <Image height="20px" width="20px" src={circleArrow} />
          </Box>
        </LinkApp>
      </Box>
    </Box>
  );
};
