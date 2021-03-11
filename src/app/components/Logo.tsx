import React from 'react';

import SVG from 'react-inlinesvg';

import logo from '@assets/images/icon.png';
import { Box, Flex, Image, ImageProps } from '@components';

interface Props {
  icon?: string;
}

export const InnerIcon = ({ icon }: { icon: string }) => (
  <Flex
    width="48px"
    height="48px"
    bg="DEFAULT_BACKGROUND"
    sx={{
      position: 'absolute',
      right: '-12px',
      bottom: '-12px',
      borderRadius: '48px'
    }}
    variant="rowCenter"
  >
    <SVG width="20px" height="20px" fill="#1eb8e7" src={icon} />
  </Flex>
);

export const Logo = ({
  width = '28px',
  height = '28px',
  icon,
  ...rest
}: Props & Omit<ImageProps, 'src'>) => (
  <Box
    variant="rowAlign"
    sx={{
      position: 'relative',
      '-webkit-app-region': 'no-drag'
    }}
  >
    <Image width={width} height={height} src={logo} {...rest} />
    {icon && <InnerIcon icon={icon} />}
  </Box>
);
