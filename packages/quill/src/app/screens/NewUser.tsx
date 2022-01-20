import { Body, Button, Heading, InlineMessage } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import { Box, Container, LinkApp, Logo, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';
import { translate } from '@translations';

export const NewUser = () => (
  <>
    <Container pt="4">
      <Box sx={{ textAlign: 'center' }}>
        <Logo width="100px" height="100px" mx="auto" />
        <Heading mt="3" mb="2">
          {translateRaw('NEW_USER_HEADER')}
        </Heading>
      </Box>
      <Body mb="4">{translate('NEW_USER_DESCRIPTION_1')}</Body>
      <Body mb="3">{translateRaw('NEW_USER_DESCRIPTION_2')}</Body>
    </Container>
    <PanelBottom variant="clear">
      <LinkApp href={ROUTE_PATHS.CREATE_PASSWORD} width="100%">
        <Button id="create-password">{translateRaw('CREATE_PASSWORD')}</Button>
      </LinkApp>
      <Box mt="2">
        <InlineMessage type="warning">{translate('NEW_USER_DESCRIPTION_3')}</InlineMessage>
      </Box>
    </PanelBottom>
  </>
);
