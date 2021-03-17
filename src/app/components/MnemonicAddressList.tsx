import React from 'react';

import { Blockie, Body, Box, Checkbox } from '@app/components';
import { GetAddressesResult } from '@types';

import { Divider } from './Divider';

export const MnemonicAddressList = ({
  addresses,
  selectedAccounts,
  toggleSelectedAccount
}: {
  addresses: GetAddressesResult[];
  selectedAccounts: string[];
  toggleSelectedAccount(account: GetAddressesResult): void;
}) => (
  <>
    {addresses.map((address) => (
      <React.Fragment key={address.dPath}>
        <Box variant="rowAlign" py="3">
          <Checkbox
            mr="3"
            onChange={() => toggleSelectedAccount(address)}
            checked={selectedAccounts.find((path) => path === address.dPath) !== undefined}
          />
          <Body mr="3">{address.index + 1}</Body>
          <Blockie mr="3" width="30px" height="30px" address={address.address} />
          <Body maxWidth="70%" sx={{ overflowWrap: 'anywhere' }}>
            {address.address}
          </Body>
        </Box>
        <Divider />
      </React.Fragment>
    ))}
  </>
);
