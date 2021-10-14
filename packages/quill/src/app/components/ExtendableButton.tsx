import { Body, Box, Flex } from '@mycrypto/ui';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import type { BoxProps } from 'rebass';

export interface ExtendableButtonProps {
  title: string;
  extendedTitle: string;
  extended?: boolean;
}

export const ExtendableButton = ({
  title,
  extendedTitle,
  extended = false,
  children,
  ...props
}: PropsWithChildren<ExtendableButtonProps & BoxProps>) => {
  const [isExtended, setExtended] = useState(extended);

  const handleToggle = () => setExtended((value) => !value);

  return (
    <Box>
      <Flex variant="horizontal-center">
        <Box
          backgroundColor="badge.muted"
          sx={{ borderRadius: '32px', cursor: 'pointer' }}
          px="3"
          py="2"
          display="inline-block"
          onClick={handleToggle}
          mb="2"
          {...props}
        >
          <Body fontWeight="bold" color="BLUE_LIGHT">
            {isExtended ? `- ${extendedTitle}` : `+ ${title}`}
          </Body>
        </Box>
      </Flex>
      {isExtended && children}
    </Box>
  );
};
