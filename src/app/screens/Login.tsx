import React, { KeyboardEvent, useState } from 'react';

import { ROUTE_PATHS } from '@app/routing';
import { login, useDispatch, useSelector } from '@app/store';
import lock from '@assets/icons/lock.svg';
import { Body, Box, Button, Flex, Heading, Input, Label, LinkApp, Logo } from '@components';
import { Trans, translateRaw } from '@translations';

export const Login = () => {
  const [password, setPassword] = useState('');
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (password.length > 0) {
      dispatch(login(password));
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  return (
    <Flex height="100%" flexDirection="column" variant="columnCenter">
      <Logo width="100px" height="100px" icon={lock} />
      <Heading fontSize="30px" lineHeight="48px" mt="32px" mb="16px">
        {translateRaw('UNLOCK_HEADER')}
      </Heading>
      <Body>{translateRaw('UNLOCK_SUBHEADING')}</Body>
      <Box width="100%" mt="16px">
        <Label htmlFor="password">{translateRaw('MYCRYPTO_PASSWORD')}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={changePassword}
          onKeyPress={handleKeyPress}
        />
      </Box>
      <Button mt="24px" type="button" disabled={password.length === 0} onClick={handleLogin}>
        {translateRaw('UNLOCK_NOW')}
      </Button>
      <Box>
        <Body mt="16px">
          <Trans
            id="FORGOT_PASSWORD_HELP"
            variables={{
              $link: () => (
                <LinkApp href={ROUTE_PATHS.FORGOT_PASSWORD} variant="defaultLink">
                  {translateRaw('FORGOT_PASSWORD_HELP_LINK')}
                </LinkApp>
              )
            }}
          />
        </Body>
        {/* @todo: Figure out if this link is necessary */}
        <Body mt="8px">
          <Trans
            id="CREATE_PASSWORD_HELP"
            variables={{
              $link: () => (
                <LinkApp href={ROUTE_PATHS.HOME} variant="defaultLink">
                  {translateRaw('CREATE_PASSWORD_HELP_LINK')}
                </LinkApp>
              )
            }}
          />
        </Body>
      </Box>
      {/* @todo: Pretty error messages */}
      {error}
    </Flex>
  );
};
