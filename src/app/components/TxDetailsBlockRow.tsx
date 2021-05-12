import { Body, Box } from '@mycrypto/ui';
import type { ReactNode } from 'react';

import { Divider } from './Divider';

export const TxDetailsBlockRow = ({
  label,
  children,
  hideDivider
}: {
  label: string;
  children: ReactNode;
  hideDivider?: boolean;
}) => (
  <>
    <Box pb="1" pt="1">
      <Body fontWeight="bold">{label}:</Body>
      {children}
    </Box>
    {!hideDivider && <Divider />}
  </>
);
