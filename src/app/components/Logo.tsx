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
    <Box
      as={SVG}
      width="20px"
      height="20px"
      sx={{
        fill: 'BLUE_BRIGHT'
      }}
      src={icon}
    />
  </Flex>
);

export const Logo = ({
  width = '28px',
  height = '28px',
  icon,
  ...rest
}: Props & Omit<ImageProps, 'src'>) => (
  <Box
    width={width}
    height={height}
    {...rest}
    sx={{
      boxSizing: 'border-box',
      position: 'relative',
      '-webkit-app-region': 'no-drag'
    }}
  >
    <Image width={width} height={height} src={logo} />
    {icon && <InnerIcon icon={icon} />}
  </Box>
);
