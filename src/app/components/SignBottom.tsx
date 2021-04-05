import React from 'react';

import { Button, PanelBottom } from '@app/components';
import { translateRaw } from '@translations';

export const SignBottom = ({
  disabled,
  handleSign,
  form
}: {
  disabled: boolean;
  handleSign?(): void;
  form?: string;
}) => (
  <PanelBottom>
    <Button id="sign_button" type="submit" form={form} disabled={disabled} onClick={handleSign}>
      {translateRaw('SIGN_TX')}
    </Button>
  </PanelBottom>
);
