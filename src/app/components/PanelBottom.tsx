import { ReactNode } from 'react';

import { Box, BoxProps } from '@app/components';

export const PanelBottom = ({
  children,
  variant = 'panel',
  ...props
}: { children: ReactNode } & BoxProps) => (
  <Box width="100%" variant={variant} sx={{ zIndex: '1' }} {...props}>
    {children}
  </Box>
);
