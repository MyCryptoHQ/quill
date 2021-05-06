import type { BigNumberish } from '@ethersproject/bignumber';
import { Body, Box } from '@mycrypto/ui';

import type { BoxProps } from '@app/components';
import { translateRaw } from '@common/translate';
import type { IAccount } from '@types';
import { bigify } from '@utils';

import { Account } from './Account';

type AccountLabel = Pick<IAccount, 'address' | 'label'>;

export const FromToAccount = ({
  sender,
  recipient,
  nonce,
  ...props
}: { sender: AccountLabel; recipient?: AccountLabel; nonce?: BigNumberish } & Omit<
  BoxProps,
  'nonce'
>) => (
  <Box variant="horizontal-start" {...props}>
    <Box mr="1">
      <Box variant="horizontal-start" color="text.secondary">
        {translateRaw('SENDER')}
        {nonce && (
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
        )}
      </Box>
      <Account address={sender.address} label={sender.label} truncate={true} pr="4" />
    </Box>
    {recipient && (
      <Box ml="1">
        {translateRaw('RECIPIENT')}
        <Account address={recipient.address} label={recipient.label} truncate={true} pr="4" />
      </Box>
    )}
  </Box>
);
