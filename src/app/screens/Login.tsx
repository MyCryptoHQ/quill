import { Body, Button, Heading } from '@mycrypto/ui';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import { ROUTE_PATHS } from '@app/routing';
import { useDispatch, useSelector } from '@app/store';
import lock from '@assets/icons/lock.svg';
import { getLoggingIn, login } from '@common/store';
import { translateRaw } from '@common/translate';
import {
  Box,
  Container,
  FormError,
  FormInput,
  Label,
  LinkApp,
  Logo,
  PanelBottom
} from '@components';
import { Trans } from '@translations';

const SCHEMA = object({
  password: string().required(translateRaw('PASSWORD_EMPTY'))
});

const initialValues = { password: '' };

export const Login = () => {
  const form = useForm(initialValues, yupValidator(SCHEMA), true);
  const error = useSelector((state) => state.auth.error);
  const loggingIn = useSelector(getLoggingIn);
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    dispatch(login(form.values.password));
  };

  useEffect(() => {
    if (error) {
      form.setError('password', error);
    }
  });

  return (
    <>
      <Container pt="4">
        <Box mx="auto" sx={{ textAlign: 'center' }}>
          <Logo width="100px" height="100px" icon={lock} mx="auto" />
          <Heading fontSize="30px" lineHeight="48px" mt="32px" mb="16px">
            {translateRaw('UNLOCK_HEADER')}
          </Heading>
        </Box>
        <Body>{translateRaw('UNLOCK_SUBHEADING')}</Body>
        <form onSubmit={handleSubmit} id="login-form">
          <Box mt="16px">
            <Label htmlFor="password">{translateRaw('MYCRYPTO_PASSWORD')}</Label>
            <FormInput id="password" name="password" type="password" form={form} />
            <FormError name="password" form={form} />
          </Box>
        </form>
      </Container>
      <PanelBottom variant="clear">
        <Button type="submit" form="login-form" disabled={loggingIn}>
          {translateRaw('UNLOCK_NOW')}
        </Button>
        <Body mt="3" textAlign="center">
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
      </PanelBottom>
    </>
  );
};
