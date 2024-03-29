import { Body, Button, SubHeading } from '@mycrypto/ui';
import { reset, translateRaw } from '@quill/common';
import { push } from 'connected-react-router';

import warning from '@assets/icons/circle-error.svg';
import { Container, Flex, Image, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';
import { useDispatch } from '@store';

export const ForgotPassword = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(reset());
    handleBack();
  };

  const handleBack = () => {
    dispatch(push(ROUTE_PATHS.LOCKED));
  };

  return (
    <>
      <Container pt="4">
        <Flex variant="vertical-center" maxWidth="300px" mx="auto">
          <Image alt="Warning" src={warning} width="100px" height="100px" />
          <SubHeading mt="4" textAlign="center">
            {translateRaw('RESET_HEADING')}
          </SubHeading>
          <Body variant="muted" mt="2" textAlign="center">
            {translateRaw('RESET_DESCRIPTION')}
          </Body>
        </Flex>
      </Container>
      <PanelBottom variant="clear">
        <Button onClick={handleBack}>{translateRaw('RESET_CANCEL')}</Button>
        <Button variant="inverted" mt="3" onClick={handleReset}>
          {translateRaw('RESET_CONFIRM')}
        </Button>
      </PanelBottom>
    </>
  );
};
