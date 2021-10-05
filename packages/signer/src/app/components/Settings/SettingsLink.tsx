import { Body } from '@mycrypto/ui';
import type { ReactElement } from 'react';

import { Box, Image, LinkApp } from '@components';

export const SettingsLink = ({
  icon,
  label,
  href
}: {
  icon: string;
  label: string | ReactElement;
  href: string;
}) => (
  <LinkApp href={href} isExternal={false}>
    <Box
      variant="horizontal-start"
      mt="3"
      p="3"
      bg="WHITE"
      sx={{
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)',
        ':hover': {
          cursor: 'pointer',
          bg: 'BG_GREY_MUTED'
        }
      }}
    >
      <Image src={icon} width="20px" height="20px" mr="2" />
      <Body color="BLUE_DARK_SLATE" fontWeight="bold">
        {label}
      </Body>
    </Box>
  </LinkApp>
);
