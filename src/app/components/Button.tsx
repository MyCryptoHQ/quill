import type { ReactNode } from 'react';
import type { ButtonProps } from 'rebass/styled-components';
import { Button as RebassButton } from 'rebass/styled-components';

export const Button = ({
  disabled,
  children,
  variant = 'primary',
  ...props
}: { disabled?: boolean; variant?: string; children: ReactNode } & ButtonProps) => (
  <RebassButton {...props} variant={variant} disabled={disabled}>
    {children}
  </RebassButton>
);
