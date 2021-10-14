import { getQueueLength } from '@quill/common';

import { useSelector } from '@app/store';
import logo from '@assets/images/icon.png';
import type { ImageProps } from '@components';
import { Box, Flex, Image } from '@components';

export const NavigationLogo = ({
  width = '28px',
  height = '28px',
  ...rest
}: Omit<ImageProps, 'src'>) => {
  const transactionCount = useSelector(getQueueLength);

  return (
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
      {transactionCount > 0 && (
        <Flex
          width="20px"
          height="20px"
          bg="PURPLE"
          sx={{
            position: 'absolute',
            right: '-7px',
            bottom: '-7px',
            borderRadius: '14px',
            color: 'WHITE',
            border: '2.44444px solid #39506A',
            fontWeight: '400',
            fontSize: '0.75rem'
          }}
          variant="horizontal-center"
        >
          {transactionCount <= 9 ? transactionCount : '9+'}
        </Flex>
      )}
    </Box>
  );
};
