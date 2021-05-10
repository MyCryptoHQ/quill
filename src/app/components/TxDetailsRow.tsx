import { Body, Box } from '@mycrypto/ui';
import type { ReactNode } from 'react';

import { Divider } from './Divider';

export const TxDetailsRow = ({
  label,
  value,
  info,
  hideDivider
}: {
  label: string;
  value: string | ReactNode;
  info?: ReactNode;
  hideDivider?: boolean;
}) => (
  <>
    <Box py="1">
      <Box variant="horizontal-start" sx={{ justifyContent: 'space-between' }}>
        <Body fontWeight="bold">{label}:</Body>
        {typeof value === 'string' ? <Body>{value}</Body> : value}
      </Box>
      {info !== undefined && info}
    </Box>
    {!hideDivider && <Divider />}
  </>
);
