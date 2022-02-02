import { forwardRef } from 'react';

import type { BoxProps } from '@components';
import { Box } from '@components';

export const Wrapper = forwardRef(({ children, ...props }: BoxProps, ref) => (
  <Box
    ref={ref}
    overflowY="auto"
    flex="1"
    backgroundColor="DEFAULT_BACKGROUND"
    data-testid="scroll-wrapper"
    {...props}
  >
    {children}
  </Box>
));

export const Container = ({ children, ...props }: BoxProps) => (
  <Box pt="3" pb="3" px="24px" backgroundColor="DEFAULT_BACKGROUND" sx={{ flex: '1' }} {...props}>
    {children}
  </Box>
);

export const ScrollableContainer = forwardRef(({ children, pt = '3', ...props }: BoxProps, ref) => (
  <Wrapper ref={ref} {...props}>
    <Container pt={pt}>{children}</Container>
  </Wrapper>
));
