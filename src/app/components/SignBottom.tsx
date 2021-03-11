import React from 'react';

import { Box, Button, LinkApp } from '@app/components';
import { translateRaw } from '@translations';

export const SignBottom = ({
  disabled,
  handleAccept,
  handleDeny
}: {
  disabled: boolean;
  handleAccept(): void;
  handleDeny(): void;
}) => (
  <Box
    sx={{ position: 'fixed', bottom: 0, border: '1px solid #E8EAED' }}
    width="100%"
    bg="white"
    px="4"
    py="3"
    mx="-24px"
  >
    <Button id="accept_button" type="button" disabled={disabled} onClick={handleAccept}>
      {translateRaw('APPROVE_TX')}
    </Button>
    <Box width="100%" p="3" sx={{ textAlign: 'center' }}>
      <LinkApp href="#" id="deny_button" onClick={handleDeny}>
        Deny Transaction
      </LinkApp>
    </Box>
  </Box>
);
