import type { BoxProps } from '@mycrypto/ui';
import { Box } from '@mycrypto/ui';
import React from 'react';

export const Badge = ({ children, ...rest }: BoxProps) => (
  <Box variant="badge" {...rest}>
    {children}
  </Box>
);
