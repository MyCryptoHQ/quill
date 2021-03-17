import React from 'react';

import { Box } from '@app/components';

export const PanelBottom = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      position: 'fixed',
      bottom: 0,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'GREY_ATHENS',
      boxShadow: '0px -12px 20px rgba(79, 79, 79, 0.11)'
    }}
    width="100%"
    bg="white"
    px="4"
    py="4"
    mx="-24px"
  >
    {children}
  </Box>
);
