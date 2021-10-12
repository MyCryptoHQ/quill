import { Body } from '@mycrypto/ui';
import type { ReactElement } from 'react';
import { useState } from 'react';

import caret from '@assets/icons/caret.svg';
import { Box, Image } from '@components';

export const SettingsAccordion = ({
  icon,
  label,
  children,
  handleOpen,
  isOpen
}: {
  icon: string;
  label: string | ReactElement;
  children: string | ReactElement | ReactElement[];
  handleOpen?(): void;
  isOpen?: boolean;
}) => {
  const [isOpenedState, setOpened] = useState(false);
  const toggleOpen = () => (handleOpen ? handleOpen() : setOpened(!isOpened));

  const isOpened = isOpen ?? isOpenedState;

  if (isOpened) {
    return (
      <Box
        mt="3"
        p="3"
        variant="settings.accordion.open"
        sx={{
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)',
          userSelect: 'none'
        }}
      >
        <Box
          onClick={toggleOpen}
          sx={{
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
            <Image
              src={caret}
              alt="Caret"
              ml="auto"
              width="20px"
              minWidth="20px"
              sx={{ userSelect: 'none', transform: 'rotate(180deg)' }}
            />
          </Box>
        </Box>
        <Box>{children && <Box mt="3">{children}</Box>}</Box>
      </Box>
    );
  }

  return (
    <Box
      mt="3"
      p="3"
      onClick={toggleOpen}
      variant="settings.accordion.default"
      sx={{
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.07)',
        ':hover': {
          cursor: 'pointer',
          bg: 'BG_GREY_MUTED'
        },
        userSelect: 'none'
      }}
    >
      <Box variant="horizontal-start">
        <Image src={icon} width="20px" height="20px" mr="2" />
        <Body color="BLUE_DARK_SLATE" fontWeight="bold">
          {label}
        </Body>
      </Box>
    </Box>
  );
};
