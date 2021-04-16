import { ReactNode } from 'react';

import { Box } from '.';

export const CodeBlock = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      border: '1px solid rgb(229, 236, 243)',
      boxShadow: 'rgb(63 63 68 / 5%) 0px 1px 0px 0px inset'
    }}
    p="2"
  >
    {children}
  </Box>
);
