import { Body, Box, Button, Heading } from '@mycrypto/ui';

import deleteIcon from '@assets/icons/circle-delete.svg';
import { LinkApp } from '@components';

import { SettingsAccordion } from './SettingsAccordion';

export const SettingsQuit = () => {
  return (
    <SettingsAccordion icon={deleteIcon} label="Quit App">
      <Heading fontSize="2" textAlign="center">
        Confirm Quit
      </Heading>
      <Body mb="2">Are you sure you want to quit?</Body>
      <Button>Quit Now</Button>
      <Box width="100%" pt="3" px="3" sx={{ textAlign: 'center' }}>
        <LinkApp href="#">Cancel</LinkApp>
      </Box>
    </SettingsAccordion>
  );
};
