import { Body, Button, Heading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import wallet from '@app/assets/icons/wallet.svg';
import { Box, Container, Image, LinkApp, PanelBottom } from '@components';
import { ROUTE_PATHS } from '@routing';

export const SetupAccount = () => (
  <>
    <Container pt="4">
      <Box sx={{ textAlign: 'center' }}>
        <Image alt="Wallet" src={wallet} width="100px" height="100px" />
      </Box>
      <Heading fontSize="24px" lineHeight="150%" mt="4" mb="2" textAlign="center">
        {translateRaw('SETUP_ACCOUNT_HEADER')}
      </Heading>
      <Body>{translateRaw('SETUP_ACCOUNT_DESCRIPTION')}</Body>
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
