import React from 'react';

import { Box, Button, LinkApp, PanelBottom } from '@app/components';
import { translateRaw } from '@translations';

export const SignBottom = ({
  disabled,
  handleAccept,
  handleDeny,
  form
}: {
  disabled: boolean;
  handleAccept?(): void;
  handleDeny(): void;
  form?: string;
}) => (
  <PanelBottom>
    <Button id="accept_button" type="submit" form={form} disabled={disabled} onClick={handleAccept}>
      {translateRaw('APPROVE_TX')}
    </Button>
    <Box width="100%" pt="3" px="3" sx={{ textAlign: 'center' }}>
      <LinkApp href="#" id="deny_button" onClick={handleDeny}>
        {translateRaw('DENY_TX')}
      </LinkApp>
    </Box>
  </PanelBottom>
);
