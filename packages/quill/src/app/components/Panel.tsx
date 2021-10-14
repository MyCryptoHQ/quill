import type { BoxProps } from '@components';
import { Box } from '@components';

export const Panel = ({ children, ...rest }: BoxProps) => (
  <Box backgroundColor="BG_GREY_MUTED" padding="3" {...rest}>
    {children}
  </Box>
);
