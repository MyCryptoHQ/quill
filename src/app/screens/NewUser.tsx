import { Body, Button, Heading } from '@mycrypto/ui';

import { translateRaw } from '@common/translate';
import { Box, Container, LinkApp, Logo, PanelBottom, PaperWallet } from '@components';
import { ROUTE_PATHS } from '@routing';
import { translate } from '@translations';
import type { TAddress } from '@types';
import { WalletType } from '@types';

export const NewUser = () => (
  <>
    <Container pt="4">
      <PaperWallet
        type={WalletType.MNEMONIC}
        address={'0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as TAddress}
        secret={'0x86fd0085f78a57ded69bafca596c9cb4afb2345e7d8c75894650f33aee5fed4e'}
      />
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
