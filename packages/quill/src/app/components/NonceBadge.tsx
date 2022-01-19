import type { BigNumberish } from '@ethersproject/bignumber';
import { Body, Box } from '@mycrypto/ui';
import { bigify, translateRaw } from '@quill/common';

export const NonceBadge = ({ nonce }: { nonce: BigNumberish }) => (
  <Box ml="auto" mr="1" variant="badge.nonce">
    <Body
      p="1"
      fontSize="0"
      fontWeight="bold"
      lineHeight="14px"
      color="text.discrete"
      sx={{ textTransform: 'uppercase' }}
    >
      {translateRaw('NONCE')}: {bigify(nonce).toString()}
    </Body>
  </Box>
);
