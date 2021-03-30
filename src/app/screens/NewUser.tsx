import React from 'react';

import { Body, Button, Flex, Heading, LinkApp, Logo } from '@components';
import { ROUTE_PATHS } from '@routing';
import { translate, translateRaw } from '@translations';

export const NewUser = () => (
  <Flex height="100%" flexDirection="column" variant="columnCenter">
    <Logo width="100px" height="100px" />
    <Heading fontSize="30px" lineHeight="48px" mt="3" mb="2">
      {translateRaw('NEW_USER_HEADER')}
    </Heading>
    <Body lineHeight="24px" mb="4">
      {translateRaw('NEW_USER_DESCRIPTION_1')}
    </Body>
    <Body lineHeight="24px" mb="4">
      {translateRaw('NEW_USER_DESCRIPTION_2')}
    </Body>
    <Body lineHeight="24px" mb="3">
      {translate('NEW_USER_DESCRIPTION_3')}
    </Body>
    <LinkApp href={ROUTE_PATHS.CREATE_PASSWORD} width="100%">
      <Button id="create-password">{translateRaw('CREATE_PASSWORD')}</Button>
    </LinkApp>
  </Flex>
);
