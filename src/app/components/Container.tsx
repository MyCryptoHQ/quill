import React from 'react';

import { Box, BoxProps } from '@components';

export const Wrapper = ({ children, ...props }: BoxProps) => (
  <Box overflowY="scroll" flex="1" backgroundColor="DEFAULT_BACKGROUND" {...props}>
    {children}
  </Box>
);

export const Container = ({ children, ...props }: BoxProps) => (
  <Box pt="3" pb="3" px="24px" backgroundColor="DEFAULT_BACKGROUND" sx={{ flex: '1' }} {...props}>
    {children}
  </Box>
);

export const ScrollableContainer = ({ children, pt, ...props }: BoxProps) => (
  <Wrapper {...props}>
    <Container pt={pt}>{children}</Container>
  </Wrapper>
);
