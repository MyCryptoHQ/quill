import { Box, BoxProps } from '@components';

export const Panel = ({ children, ...rest }: BoxProps) => (
  <Box backgroundColor="BG_GREY_MUTED" padding="3" {...rest}>
    {children}
  </Box>
);
