import React from 'react';

import logo from '@assets/images/icon.png';
import { Box, Image, ImageProps } from '@components';

export const Logo = ({ width = '28px', height = '28px', ...rest }: Omit<ImageProps, 'src'>) => (
  <Box
    variant="rowAlign"
    sx={{
      '-webkit-app-region': 'no-drag'
    }}
  >
    <Image width={width} height={height} src={logo} {...rest} />
  </Box>
);
