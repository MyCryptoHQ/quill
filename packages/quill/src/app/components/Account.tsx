import { Blockie, Body } from '@mycrypto/ui';
import { translateRaw, truncate } from '@quill/common';
import type { TAddress } from '@quill/common';

import type { BoxProps } from '@app/components';
import { Box } from '@app/components';

export const Account = ({
  label,
  address,
  truncate: shouldTruncate,
  addressColor,
  ...props
}: { address: TAddress; label?: string; truncate: boolean; addressColor?: string } & BoxProps) => (
  <Box bg="GREY_LIGHTEST" p="10px" variant="horizontal-start" {...props}>
    <Blockie height="32px" width="32px" minWidth="32px" address={address} />
    <Box pl="1">
      <Body fontSize="3">{label ?? translateRaw('NO_LABEL')}</Body>
      <Body sx={{ overflow: 'hidden', textOverflow: 'ellipsis', color: addressColor }}>
        {shouldTruncate ? truncate(address) : address}
      </Body>
    </Box>
  </Box>
);
