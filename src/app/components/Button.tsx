import React from 'react';

import { ButtonProps, Button as RebassButton } from 'rebass/styled-components';

export const Button = ({
  disabled,
  children,
  variant = 'default',
  ...props
}: { disabled?: boolean; variant?: string; children: React.ReactNode } & ButtonProps) => (
  <RebassButton {...props} variant={variant} disabled={disabled}>
    {children}
  </RebassButton>
);
