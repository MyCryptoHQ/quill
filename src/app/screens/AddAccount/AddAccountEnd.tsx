import React from 'react';

import { Body, Box, Button, Flex, Heading, LinkApp, Logo } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import checkmark from '@assets/icons/circle-checkmark.svg';
import { translateRaw } from '@translations';

export const AddAccountEnd = () => (
  <Flex height="100%" flexDirection="column" variant="columnAlign">
    <Logo width="100px" height="100px" icon={checkmark} mt="3" />
    <Heading fontSize="30px" lineHeight="48px" mt="4" mb="3">
      {translateRaw('ADD_ACCOUNT_END_HEADER')}
    </Heading>
    <Body>{translateRaw('ADD_ACCOUNT_END_BODY')}</Body>
    <Box width="100%" variant="columnAlign" sx={{ flexGrow: '1', justifyContent: 'flex-end' }}>
      <LinkApp href={ROUTE_PATHS.HOME} width="100%" mb="3">
        <Button>{translateRaw('BACK_TO_HOME')}</Button>
      </LinkApp>
      <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT} width="100%" mb="3">
        <Button variant="inverted">{translateRaw('ADD_ANOTHER_ACCOUNT')}</Button>
      </LinkApp>
    </Box>
  </Flex>
);
