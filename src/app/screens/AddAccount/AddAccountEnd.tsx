import React from 'react';

import { Body, Box, Button, Container, Heading, LinkApp, Logo, PanelBottom } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import checkmark from '@assets/icons/circle-checkmark.svg';
import { translateRaw } from '@translations';

export const AddAccountEnd = () => (
  <>
    <Container>
      <Box sx={{ textAlign: 'center' }}>
        <Logo width="100px" height="100px" icon={checkmark} mx="auto" />
        <Heading fontSize="30px" lineHeight="48px" mt="4" mb="3">
          {translateRaw('ADD_ACCOUNT_END_HEADER')}
        </Heading>
        <Body>{translateRaw('ADD_ACCOUNT_END_BODY')}</Body>
      </Box>
    </Container>
    <PanelBottom variant="clear">
      <LinkApp href={ROUTE_PATHS.HOME} width="100%" sx={{ display: 'block' }}>
        <Button>{translateRaw('BACK_TO_HOME')}</Button>
      </LinkApp>
      <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT} width="100%">
        <Button variant="inverted" mt="3">
          {translateRaw('ADD_ANOTHER_ACCOUNT')}
        </Button>
      </LinkApp>
    </PanelBottom>
  </>
);
