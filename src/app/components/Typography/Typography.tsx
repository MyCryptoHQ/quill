import React, { Ref } from 'react';

import { Text, TextProps } from 'theme-ui';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
  ref: Ref<HTMLDivElement>;
}

export const Heading = ({ children, as = 'h1', ...props }: TypographyProps) => (
  <Text as={as} variant="heading" {...props}>
    {children}
  </Text>
);

export const SubHeading = ({ children, as = 'h2', ...props }: TypographyProps) => (
  <Text as={as} variant="subHeading" {...props}>
    {children}
  </Text>
);

export const Body = ({ children, as = 'p', ...props }: TypographyProps) => (
  <Text as={as} variant="body" {...props}>
    {children}
  </Text>
);
