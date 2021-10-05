import { Body } from '@mycrypto/ui';
import type { ReactElement } from 'react';
import { useState } from 'react';

import caret from '@assets/icons/caret.svg';
import { Box, Image } from '@components';

export const SettingsAccordion = ({
  icon,
  label,
  children
}: {
  icon: string;
  label: string | ReactElement;
  children: string | ReactElement | ReactElement[];
}) => {
  const [isOpened, setOpened] = useState(false);
  const toggleOpen = () => setOpened(!isOpened);

  return (
    <Box
      mt="3"
      p="3"
      onClick={toggleOpen}
      variant={isOpened ? 'settings.accordion.open' : 'settings.accordion.default'}
      sx={{
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)',
        ':hover': {
          cursor: 'pointer',
          bg: 'BG_GREY_MUTED'
        }
      }}
    >
      <Box variant="horizontal-start">
        <Image src={icon} width="20px" height="20px" mr="2" />
        <Body color="BLUE_DARK_SLATE" fontWeight="bold">
          {label}
        </Body>
        {isOpened && (
          <Image
            src={caret}
            alt="Caret"
            ml="auto"
            width="20px"
            minWidth="20px"
            sx={{ userSelect: 'none', transform: 'rotate(180deg)' }}
          />
        )}
      </Box>
      {isOpened && children && <Box mt="3">{children}</Box>}
    </Box>
  );
};
