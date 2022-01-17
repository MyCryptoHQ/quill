import { Blockie, Body } from '@mycrypto/ui';
import type { DeterministicAddress } from '@mycrypto/wallets';
import { getAccounts, translateRaw } from '@quill/common';
import { Fragment } from 'react';

import { Box, Checkbox } from '@app/components';
import { useSelector } from '@app/store';

import { ConditionalTooltip } from './ConditionalTooltip';
import { Divider } from './Divider';

export const MnemonicAddressList = ({
  addresses,
  selectedAccounts,
  toggleSelectedAccount
}: {
  addresses: DeterministicAddress[];
  selectedAccounts: number[];
  toggleSelectedAccount(account: DeterministicAddress): void;
}) => {
  const accounts = useSelector(getAccounts);

  return (
    <>
      {addresses.map((address) => {
        const existingAddress = accounts.some((a) => a.address === address.address);
        const toggle = () => {
          if (!existingAddress) toggleSelectedAccount(address);
        };
        return (
          <Fragment key={address.dPath}>
            <ConditionalTooltip
              tooltip={translateRaw('ACCOUNT_ALREADY_EXISTS_TOOLTIP')}
              condition={existingAddress}
            >
              <Box
                variant="horizontal-start"
                py="3"
                opacity={existingAddress ? 0.5 : 1}
                onClick={toggle}
              >
                <Checkbox
                  mr="3"
                  checked={
                    existingAddress || selectedAccounts.some((index) => index === address.index)
                  }
                  data-testid={`checkbox-${address.address}`}
                />
                <Body mr="3">{address.index + 1}</Body>
                <Blockie mr="3" width="30px" height="30px" address={address.address} />
                <Body maxWidth="70%" sx={{ overflowWrap: 'anywhere' }}>
                  {address.address}
                </Body>
              </Box>
            </ConditionalTooltip>
            <Divider />
          </Fragment>
        );
      })}
    </>
  );
};
