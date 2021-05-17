import type { BigNumberish } from '@ethersproject/bignumber';
import { Body, Box } from '@mycrypto/ui';

import { translateRaw } from '@common/translate';
import { bigify } from '@common/utils';

export const NonceBadge = ({ nonce }: { nonce: BigNumberish }) => (
  <Box ml="auto" mr="1" variant="badge.nonce">
    <Body
      p="1"
      fontSize="10px"
      fontWeight="bold"
      lineHeight="14px"
      color="text.discrete"
      sx={{ textTransform: 'uppercase' }}
    >
      {translateRaw('NONCE')}: {bigify(nonce).toString()}
    </Body>
  </Box>
);
