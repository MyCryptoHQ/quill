import type { TextProps } from '@mycrypto/ui';
import { Text } from '@mycrypto/ui';
import type { FunctionComponent } from 'react';

// Expanded version of Typography from UI

export const Heading3: FunctionComponent<TextProps> = ({ children, as = 'h3', ...props }) => (
  <Text as={as} variant="heading3" {...props}>
    {children}
  </Text>
);
