import React, { FormEvent } from 'react';

import { object, refine, string } from 'superstruct';
import { useForm } from 'typed-react-form';

import { ROUTE_PATHS } from '@app/routing';
import { login, useDispatch, useSelector } from '@app/store';
import { getValidator } from '@app/utils';
import lock from '@assets/icons/lock.svg';
import {
  Body,
  Box,
  Button,
  Flex,
  FormError,
  FormInput,
  Heading,
  Label,
  LinkApp,
  Logo
} from '@components';
import { Trans, translateRaw } from '@translations';

const LOGIN_STRUCT = object({
  password: refine(string(), 'Not empty', (value) => {
    if (value.length > 0) {
      return true;
    }

    return translateRaw('PASSWORD_EMPTY');
  })
});

export const Login = () => {
  const form = useForm({ password: '' }, getValidator(LOGIN_STRUCT), true);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    dispatch(login(form.values.password));
  };

  return (
    <Flex height="100%" flexDirection="column" variant="columnCenter">
      <Logo width="100px" height="100px" icon={lock} />
      <Heading fontSize="30px" lineHeight="48px" mt="32px" mb="16px">
        {translateRaw('UNLOCK_HEADER')}
      </Heading>
      <Body>{translateRaw('UNLOCK_SUBHEADING')}</Body>
      <Box width="100%">
        <form onSubmit={handleSubmit}>
          <Box mt="16px">
            <Label htmlFor="password">{translateRaw('MYCRYPTO_PASSWORD')}</Label>
            <FormInput id="password" name="password" type="password" form={form} />
            <FormError name="password" form={form} />
          </Box>
          <Button mt="24px" type="submit">
            {translateRaw('UNLOCK_NOW')}
          </Button>
        </form>
      </Box>
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
