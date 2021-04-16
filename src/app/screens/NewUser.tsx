import { Body, Heading } from '@mycrypto/ui';

import { translateRaw } from '@common/translate';
import { Box, Button, Container, LinkApp, Logo, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';
import { translate } from '@translations';

export const NewUser = () => (
  <>
    <Container pt="4">
      <Box sx={{ textAlign: 'center' }}>
        <Logo width="100px" height="100px" mx="auto" />
        <Heading fontSize="30px" lineHeight="48px" mt="3" mb="2">
          {translateRaw('NEW_USER_HEADER')}
        </Heading>
      </Box>
      <Body lineHeight="24px" mb="4">
        {translateRaw('NEW_USER_DESCRIPTION_1')}
      </Body>
      <Body lineHeight="24px" mb="4">
        {translateRaw('NEW_USER_DESCRIPTION_2')}
      </Body>
      <Body lineHeight="24px">{translate('NEW_USER_DESCRIPTION_3')}</Body>
    </Container>
    <PanelBottom variant="clear">
      <LinkApp href={ROUTE_PATHS.CREATE_PASSWORD} width="100%">
        <Button id="create-password">{translateRaw('CREATE_PASSWORD')}</Button>
      </LinkApp>
    </PanelBottom>
  </>
);
