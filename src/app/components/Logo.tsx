import SVG from 'react-inlinesvg';

import logo from '@assets/images/icon.png';
import type { ImageProps } from '@components';
import { Box, Flex, Image } from '@components';

interface Props {
  icon?: string;
  fillIcon?: boolean;
}

export const InnerIcon = ({ icon, fillIcon }: { icon: string; fillIcon: boolean }) => (
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
    variant="horizontal-center"
  >
    <Box
      as={SVG}
      width="20px"
      height="20px"
      sx={
        fillIcon && {
          fill: 'BLUE_BRIGHT'
        }
      }
      src={icon}
    />
  </Flex>
);

export const Logo = ({
  width = '28px',
  height = '28px',
  icon,
  fillIcon = true,
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
    {icon && <InnerIcon icon={icon} fillIcon={fillIcon} />}
  </Box>
);
