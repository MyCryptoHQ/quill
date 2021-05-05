import type { TextProps } from '@mycrypto/ui';
import { Heading } from '@mycrypto/ui';
import { goBack } from 'connected-react-router';

import back from '@assets/icons/back.svg';
import { Box, Image } from '@components';
import { useDispatch } from '@store';

export const BackHeading = ({ children, ...props }: TextProps) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(goBack());
  };

  return (
    <>
      <Box mt="2">
        <Image
          alt="Back"
          src={back}
          width="20px"
          height="16px"
          onClick={handleBack}
          data-testid="back-button"
          sx={{
            cursor: 'pointer'
          }}
        />
      </Box>
      <Box maxWidth="75%" mx="auto">
        <Heading as="h2" fontSize="24px" lineHeight="36px" textAlign="center" mb="2" {...props}>
          {children}
        </Heading>
      </Box>
    </>
  );
};
