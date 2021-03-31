import React from 'react';

import { Box, BoxProps } from '@components';

export const Container = ({ children, ...props }: BoxProps) => {
  return (
    <Box
      pt="3"
      pb="3"
      px="24px"
      backgroundColor="DEFAULT_BACKGROUND"
      overflowY="auto"
      sx={{ flex: '1' }}
      {...props}
    >
      {children}
    </Box>
  );
};
