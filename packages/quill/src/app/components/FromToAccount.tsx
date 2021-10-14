import type { BigNumberish } from '@ethersproject/bignumber';
import { Box } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import type { IAccount } from '@quill/common';

import type { BoxProps } from '@app/components';

import { Account } from './Account';
import { NonceBadge } from './NonceBadge';

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
        {nonce && <NonceBadge nonce={nonce} />}
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
