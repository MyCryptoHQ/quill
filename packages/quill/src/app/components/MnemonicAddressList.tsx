import { Blockie, Body } from '@mycrypto/ui';
import type { DeterministicAddress } from '@mycrypto/wallets';
import { Fragment } from 'react';

import { Box, Checkbox } from '@app/components';

import { Divider } from './Divider';

export const MnemonicAddressList = ({
  addresses,
  selectedAccounts,
  toggleSelectedAccount
}: {
  addresses: DeterministicAddress[];
  selectedAccounts: number[];
  toggleSelectedAccount(account: DeterministicAddress): void;
}) => (
  <>
    {addresses.map((address) => {
      const toggle = () => toggleSelectedAccount(address);
      return (
        <Fragment key={address.dPath}>
          <Box variant="horizontal-start" py="3" onClick={toggle}>
            <Checkbox
              mr="3"
              checked={selectedAccounts.find((index) => index === address.index) !== undefined}
              data-testid={`checkbox-${address.address}`}
            />
            <Body mr="3">{address.index + 1}</Body>
            <Blockie mr="3" width="30px" height="30px" address={address.address} />
            <Body maxWidth="70%" sx={{ overflowWrap: 'anywhere' }}>
              {address.address}
            </Body>
          </Box>
          <Divider />
        </Fragment>
      );
    })}
  </>
);
