import React, { FormEvent } from 'react';

import { createPassword, useDispatch } from '@store';
import { object, refine, string } from 'superstruct';
import { FormError, useForm } from 'typed-react-form';
import zxcvbn from 'zxcvbn';

import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { Body, Box, Button, Flex, Heading, Image, Input, Label } from '@components';
import { REQUIRED_PASSWORD_STRENGTH } from '@config';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';

const CREATE_PASSWORD_STRUCT = object({
  password: refine(string(), 'Strong password', (value) => {
    if (zxcvbn(value).score >= REQUIRED_PASSWORD_STRENGTH) {
      return true;
    }

    return translateRaw('PASSWORD_TOO_WEAK');
  }),
  passwordConfirmation: refine(string(), 'Equal to password', (value, context) => {
    return value === context.branch[0].password;
  })
});

export const CreatePassword = () => {
  const dispatch = useDispatch();
  const form = useForm(
    {
      password: '',
      passwordConfirmation: ''
    },
    getValidator(CREATE_PASSWORD_STRUCT)
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
    <Box mx="8px">
      <Heading fontSize="24px" lineHeight="150%" mt="24px" mb="8px" textAlign="center">
        Create a Password
      </Heading>
      <Body>{translateRaw('CREATE_PASSWORD_DESCRIPTION_1')}</Body>
      <form onSubmit={handleSubmit}>
        <Box width="100%" mt="16px">
          <Label htmlFor="password">{translateRaw('ENTER_PASSWORD')}</Label>
          <Input id="password" name="password" type="password" form={form} />
          <FormError name="password" form={form} />
        </Box>
        <Box width="100%" mt="16px">
          <Label htmlFor="passwordConfirmation">{translateRaw('CONFIRM_PASSWORD')}</Label>
          <Input
            id="passwordConfirmation"
            name="passwordConfirmation"
            type="password"
            form={form}
          />
          <FormError name="passwordConfirmation" form={form} />
        </Box>
        <Flex mt="20px">
          <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="6px" />
          <Body>
            {translate('CREATE_PASSWORD_DESCRIPTION_2', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
            })}
          </Body>
        </Flex>
        <Button type="submit">{translateRaw('CREATE_PASSWORD')}</Button>
      </form>
    </Box>
  );
};
