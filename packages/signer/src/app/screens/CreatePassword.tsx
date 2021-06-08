import { Body, Button, Heading } from '@mycrypto/ui';
import { createPassword, getLoggingIn, translateRaw } from '@signer/common';
import { passwordStrength } from 'check-password-strength';
import type { FormEvent } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, ref, string } from 'yup';

import warning from '@assets/icons/circle-warning.svg';
import {
  Box,
  Flex,
  FormError,
  FormInput,
  Image,
  Label,
  PanelBottom,
  ScrollableContainer
} from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';
import { PasswordStrength } from '@types';

const SCHEMA = object({
  password: string()
    .required(translateRaw('PASSWORD_EMPTY'))
    .test('strong-password', translateRaw('PASSWORD_TOO_WEAK'), (value) => {
      return passwordStrength(value).id === PasswordStrength.STRONG;
    }),
  passwordConfirmation: string()
    .required()
    .is([ref('password')], translateRaw('PASSWORDS_NOT_EQUAL'))
});

export const CreatePassword = () => {
  const dispatch = useDispatch();
  const form = useForm(
    {
      password: '',
      passwordConfirmation: ''
    },
    yupValidator(SCHEMA),
    true
  );
  const loggingIn = useSelector(getLoggingIn);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    dispatch(createPassword(form.values.password));
  };

  return (
    <>
      <ScrollableContainer pt="4">
        <Heading fontSize="24px" lineHeight="150%" mb="2" textAlign="center">
          Create a Password
        </Heading>
        <Body>{translate('CREATE_PASSWORD_DESCRIPTION_1')}</Body>
        <form onSubmit={handleSubmit} id="create-password-form">
          <Box width="100%" mt="3">
            <Label htmlFor="password">{translateRaw('ENTER_PASSWORD')}</Label>
            <FormInput id="password" name="password" type="password" form={form} />
            <FormError name="password" form={form} />
          </Box>
          <Box width="100%" mt="3">
            <Label htmlFor="passwordConfirmation">{translateRaw('CONFIRM_PASSWORD')}</Label>
            <FormInput
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              form={form}
            />
            <FormError name="passwordConfirmation" form={form} />
          </Box>
          <Flex mt="20px">
            <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
            <Body>
              {translate('CREATE_PASSWORD_DESCRIPTION_2', {
                $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
              })}
            </Body>
          </Flex>
        </form>
      </ScrollableContainer>
      <PanelBottom>
        <Button type="submit" form="create-password-form" loading={loggingIn}>
          {translateRaw('CREATE_PASSWORD')}
        </Button>
      </PanelBottom>
    </>
  );
};
