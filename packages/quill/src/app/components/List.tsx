import type { TextProps } from '@mycrypto/ui';
import { Body, Box } from '@mycrypto/ui';
import type { BoxProps } from 'rebass';
import styled from 'styled-components';

export interface IconListProps {
  icon?: string;
}

const SList = styled(Box)<IconListProps>`
  li {
    padding: 0 0 0 29px;
    background: ${({ icon }) => (icon ? `url('${icon}') no-repeat` : 'initial')};
    list-style-type: ${({ icon }) => (icon ? 'none' : 'initial')};
  }
`;

export const List = ({ children, ...props }: BoxProps) => (
  <Box as="ul" {...props}>
    {children}
  </Box>
);

export const IconList = ({ children, ...props }: IconListProps & BoxProps) => (
  <SList as="ul" pl="0" mt="3" {...props}>
    {children}
  </SList>
);

export const ListItem = ({ children, ...props }: TextProps) => (
  <Body as="li" mb="2" sx={{ listStylePosition: 'inside' }} {...props}>
    {children}
  </Body>
);
