import React, { FormEvent } from 'react';

import { passwordStrength } from 'check-password-strength';
import { object, refine, string } from 'superstruct';
import { useForm } from 'typed-react-form';

import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import {
  Body,
  Box,
  Button,
  Flex,
  FormError,
  FormInput,
  Heading,
  Image,
  Label,
  PanelBottom
} from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { createPassword, useDispatch } from '@store';
import { translate, translateRaw } from '@translations';
import { PasswordStrength } from '@types';

const CREATE_PASSWORD_STRUCT = object({
  password: refine(string(), 'Strong password', (value) => {
    if (passwordStrength(value).id === PasswordStrength.STRONG) {
      return true;
    }

    return translateRaw('PASSWORD_TOO_WEAK');
  }),
  passwordConfirmation: refine(string(), 'Equal to password', (value, context) => {
    if (value === context.branch[0].password) {
      return true;
    }

    return translateRaw('PASSWORDS_NOT_EQUAL');
  })
});

export const CreatePassword = () => {
  const dispatch = useDispatch();
  const form = useForm(
    {
      password: '',
      passwordConfirmation: ''
    },
    getValidator(CREATE_PASSWORD_STRUCT),
    true
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    dispatch(createPassword(form.values.password));
  };

  return (
    <Box mb="122px">
      <Heading fontSize="24px" lineHeight="150%" mt="4" mb="2" textAlign="center">
        Create a Password
      </Heading>
      <Body>{translateRaw('CREATE_PASSWORD_DESCRIPTION_1')}</Body>
      <form onSubmit={handleSubmit}>
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
        <PanelBottom>
          <Button type="submit">{translateRaw('CREATE_PASSWORD')}</Button>
        </PanelBottom>
      </form>
    </Box>
  );
};
