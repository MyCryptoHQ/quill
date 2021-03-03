import React from 'react';

import { Image } from 'rebass';

import add from '@assets/icons/add.svg';
import lock from '@assets/icons/lock.svg';
import profile from '@assets/icons/profile.svg';
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
        <Image height="20px" width="20px" src={lock} mx="10px" />
        <Image height="20px" width="20px" src={profile} mx="10px" />
        <Image height="20px" width="20px" src={add} mx="10px" />
      </Box>
    )}
  </Box>
);
