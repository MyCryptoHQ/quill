import React from 'react';

import { HeadingProps, Text, TextProps } from 'rebass/styled-components';

export const Heading = ({ children, as = 'h1', ...props }: HeadingProps) => (
  <Heading as={as} variant="heading" {...props}>
    {children}
  </Heading>
);

export const SubHeading = ({ children, as = 'h2', ...props }: TextProps) => (
  <Heading as={as} variant="subHeading" {...props}>
    {children}
  </Heading>
);

export const Body = ({ children, as = 'p', ...props }: TextProps) => (
  <Text as={as} variant="body" {...props}>
    {children}
  </Text>
);
