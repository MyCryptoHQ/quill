import React from 'react';

import { ROUTE_PATHS } from '@routing';
import { Flex, Image } from 'rebass';

import wallet from '@app/assets/icons/wallet.svg';
import { Body, Box, Button, Heading, LinkApp } from '@components';
import { translateRaw } from '@translations';

export const SetupAccount = () => (
  <Box>
    <Flex mt="4">
      <Image alt="Wallet" src={wallet} width="100px" height="100px" mx="auto" />
    </Flex>
    <Heading fontSize="24px" lineHeight="150%" mt="4" mb="2" textAlign="center">
      {translateRaw('SETUP_ACCOUNT_HEADER')}
    </Heading>
    <Body mb="5">{translateRaw('SETUP_ACCOUNT_DESCRIPTION')}</Body>
    <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT}>
      <Button mb="3">{translateRaw('ADD_ACCOUNT')}</Button>
    </LinkApp>
    <LinkApp href={ROUTE_PATHS.GENERATE_ACCOUNT}>
      <Button variant="inverted">{translateRaw('GENERATE_ACCOUNT')}</Button>
    </LinkApp>
  </Box>
);
