import { Body, Box } from '@mycrypto/ui';
import type { PropsWithChildren } from 'react';
import { useTheme } from 'styled-components';

import type { BannerType } from '@types';

interface BadgeProps {
  type: BannerType;
}

export const Badge = ({ type, children }: PropsWithChildren<Pick<BadgeProps, 'type'>>) => {
  const theme = useTheme();

  return (
    <Box backgroundColor={theme.variants.banner[type].color} sx={{ borderRadius: 'banner' }}>
      <Body
        fontSize="12px"
        fontWeight="bold"
        color="white"
        sx={{ textTransform: 'uppercase' }}
        px="6px"
      >
        {children}
      </Body>
    </Box>
  );
};
