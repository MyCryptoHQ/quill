import { Body, Button, Heading } from '@mycrypto/ui';
import { push } from 'connected-react-router';

import warning from '@assets/icons/circle-error.svg';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@common/translate';
import { Container, Flex, Image, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';
import { setNewUser, useDispatch } from '@store';
import { DBRequestType } from '@types';

export const ForgotPassword = () => {
  const dispatch = useDispatch();

  const handleReset = () => {
    ipcBridgeRenderer.db.invoke({ type: DBRequestType.RESET });
    dispatch(setNewUser(true));
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
          <Heading fontSize="4" lineHeight="24px" mt="4" textAlign="center">
            {translateRaw('RESET_HEADING')}
          </Heading>
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
