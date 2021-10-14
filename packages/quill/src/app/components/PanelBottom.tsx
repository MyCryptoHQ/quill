import type { ReactNode } from 'react';

import type { BoxProps } from '@app/components';
import { Box } from '@app/components';

export const PanelBottom = ({
  children,
  variant = 'panel',
  ...props
}: { children: ReactNode } & BoxProps) => (
  <Box width="100%" variant={variant} sx={{ zIndex: '1' }} {...props}>
    {children}
  </Box>
);
