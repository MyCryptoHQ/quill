import React from 'react';

import { Image } from 'rebass';

import logo from '@assets/images/icon.png';

import { Box } from '.';

export const Navigation = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <Box
    width="100%"
    height="65px"
    backgroundColor="BLUE_DARK_SLATE"
    variant="rowAlign"
    borderTopLeftRadius="5px"
    borderTopRightRadius="5px"
  >
    <Box variant="rowAlign">
      <Image height="28px" width="28px" src={logo} marginLeft="18px" />
    </Box>
    {isLoggedIn && (
      <Box display="flex" ml="auto">
        <Image height="28px" width="28px" src={logo} mx="10px" />
        <Image height="28px" width="28px" src={logo} mx="10px" />
        <Image height="28px" width="28px" src={logo} mx="10px" />
      </Box>
    )}
  </Box>
);
