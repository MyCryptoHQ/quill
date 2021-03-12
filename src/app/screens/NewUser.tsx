import React from 'react';

import { ROUTE_PATHS } from '@routing';

import { Body, Button, Flex, Heading, LinkApp, Logo } from '@components';
import { translate, translateRaw } from '@translations';

export const NewUser = () => (
  <Flex height="100%" flexDirection="column" variant="columnCenter" mx="8px">
    <Logo width="100px" height="100px" />
    <Heading fontSize="30px" lineHeight="48px" mt="12px" mb="9px">
      {translateRaw('NEW_USER_HEADER')}
    </Heading>
    <Body lineHeight="24px" mb="24px">
      {translateRaw('NEW_USER_DESCRIPTION_1')}
    </Body>
    <Body lineHeight="24px" mb="24px">
      {translateRaw('NEW_USER_DESCRIPTION_2')}
    </Body>
    <Body lineHeight="24px" mb="16px">
      {translate('NEW_USER_DESCRIPTION_3')}
    </Body>
    <LinkApp href={ROUTE_PATHS.CREATE_PASSWORD} width="100%">
      <Button>{translateRaw('CREATE_PASSWORD')}</Button>
    </LinkApp>
  </Flex>
);
