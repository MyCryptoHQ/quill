import React from 'react';

import { HeadingProps, Text, TextProps } from 'rebass/styled-components';

export const Heading = ({ children, as = 'h1', ...props }: HeadingProps) => (
  <Text as={as} variant="heading" {...props}>
    {children}
  </Text>
);

export const SubHeading = ({ children, as = 'h2', ...props }: TextProps) => (
  <Text as={as} variant="subHeading" {...props}>
    {children}
  </Text>
);

export const Body = ({ children, as = 'p', ...props }: TextProps) => (
  <Text as={as} variant="body" {...props}>
    {children}
  </Text>
);
