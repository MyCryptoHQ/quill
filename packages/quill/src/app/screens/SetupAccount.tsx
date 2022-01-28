import { Body, Box, Button, SubHeading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import wallet from '@app/assets/icons/home.svg';
import { Container, Image, LinkApp, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';

export const SetupAccount = () => (
  <>
    <Container pt="4">
      <Box sx={{ textAlign: 'center' }}>
        <Image alt="Wallet" src={wallet} />
      </Box>
      <Box maxWidth="80%" mx="auto" sx={{ textAlign: 'center' }}>
        <SubHeading mt="3" mb="2">
          {translateRaw('SETUP_ACCOUNT_HEADER')}
        </SubHeading>
        <Body variant="muted">{translateRaw('SETUP_ACCOUNT_DESCRIPTION')}</Body>
      </Box>
    </Container>
    <PanelBottom variant="clear">
      <LinkApp href={ROUTE_PATHS.GENERATE_ACCOUNT}>
        <Button mb="3">{translateRaw('GENERATE_ACCOUNT')}</Button>
      </LinkApp>
      <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT}>
        <Button variant="inverted">{translateRaw('ADD_ACCOUNT')}</Button>
      </LinkApp>
    </PanelBottom>
  </>
);
