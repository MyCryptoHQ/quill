import React from 'react';

import back from '@app/assets/icons/back.svg';
import { Box, BoxProps, Flex, FlexProps, Image } from '@components';

interface Props {
  steps: number;
  currentStep: number;

  onPrevious(): void;
}

const Item = (props: BoxProps) => (
  <Box
    width="8px"
    height="8px"
    backgroundColor="BLUE_LIGHT"
    ml="13px"
    display="inline-block"
    sx={{
      borderRadius: '50%'
    }}
    {...props}
  />
);

const ActiveItem = () => (
  <Item
    backgroundColor="none"
    sx={{
      boxShadow: ({ colors }) => `0 0 0 4px ${colors.BLUE_LIGHT}`,
      borderRadius: '50%'
    }}
  />
);

export const FlowHeader = ({
  onPrevious,
  steps,
  currentStep,
  ...props
}: Props & Omit<FlexProps, 'variant' | 'sx'>) => (
  <Flex
    {...props}
    variant="rowCenter"
    sx={{
      justifyContent: 'space-between'
    }}
  >
    <Box>
      <Image
        alt="Back"
        src={back}
        width="20px"
        height="16px"
        onClick={onPrevious}
        sx={{
          cursor: 'pointer'
        }}
      />
    </Box>
    <Box>
      {new Array(steps)
        .fill(undefined)
        .map((_, index) =>
          index === currentStep ? (
            <ActiveItem key={`step-${index}`} />
          ) : (
            <Item key={`step-${index}`} />
          )
        )}
    </Box>
  </Flex>
);
