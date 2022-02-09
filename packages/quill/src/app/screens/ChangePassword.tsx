import { Body, Button, InlineMessage, SubHeading } from '@mycrypto/ui';
import { changePassword, getLoggingIn, translateRaw } from '@quill/common';
import { Label } from '@rebass/forms/styled-components';
import type { FormEvent, FunctionComponent } from 'react';
import { useEffect } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import {
  Box,
  FormError,
  FormInput,
  FormPasswordStrength,
  PanelBottom,
  ScrollableContainer
} from '@components';
import { PASSWORD_SCHEMA } from '@screens/CreatePassword';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

const SCHEMA = object({
  currentPassword: string().required(translateRaw('PASSWORD_EMPTY'))
});

export const ChangePassword: FunctionComponent = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(getLoggingIn);
  const error = useSelector((state) => state.auth.error);

  const form = useForm(
    {
      currentPassword: '',
      password: '',
      passwordConfirmation: ''
    },
    yupValidator(PASSWORD_SCHEMA.concat(SCHEMA), {
      abortEarly: false
    }),
    true
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    dispatch(
      changePassword({
        currentPassword: form.values.currentPassword,
        password: form.values.password
      })
    );
  };

  useEffect(() => {
    if (error) {
      form.setError('currentPassword', error);
    }
  }, [error]);

  return (
    <>
      <ScrollableContainer pt="4">
        <SubHeading mb="2" textAlign="center">
          {translateRaw('CHANGE_YOUR_PASSWORD')}
        </SubHeading>
        <Body>{translateRaw('CHANGE_PASSWORD_BODY')}</Body>
        <form onSubmit={handleSubmit} id="create-password-form">
          <Box width="100%" mt="2">
            <Label htmlFor="currentPassword">{translateRaw('ENTER_CURRENT_PASSWORD')}</Label>
            <FormInput id="currentPassword" name="currentPassword" type="password" form={form} />
            <FormError name="currentPassword" form={form} />
          </Box>
          <Box width="100%" mt="2">
            <Label htmlFor="password">{translateRaw('NEW_PASSWORD')}</Label>
            <FormInput id="password" name="password" type="password" form={form} />
            <FormPasswordStrength form={form} name="password" />
          </Box>
          <Box width="100%" mt="2">
            <Label htmlFor="passwordConfirmation">{translateRaw('CONFIRM_NEW_PASSWORD')}</Label>
            <FormInput
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              form={form}
            />
            <FormError name="passwordConfirmation" form={form} />
          </Box>
          <Box mt="2">
            <InlineMessage type="warning">{translate('NEW_USER_DESCRIPTION_3')}</InlineMessage>
          </Box>
        </form>
      </ScrollableContainer>
      <PanelBottom variant="clear">
        <Button type="submit" form="create-password-form" loading={loggingIn}>
          {translateRaw('CHANGE_PASSWORD')}
        </Button>
      </PanelBottom>
    </>
  );
};
