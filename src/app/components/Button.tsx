import React from 'react';

import { ButtonProps, Button as RebassButton } from 'rebass/styled-components';

export const Button = ({ disabled, children, ...props }: { disabled?: boolean, children: React.ReactNode } & ButtonProps) => (
  <RebassButton
    {...props}
    sx={{
      bg: disabled ? 'GREY_LIGHT' : 'BLUE_LIGHT',
      '&:hover': {
        cursor: disabled ? 'default' : 'pointer',
        bg: disabled ? 'GREY_LIGHT' : 'BLUE_LIGHT_DARKISH'
      }
    }}
  >
    {children}
  </RebassButton>
);
