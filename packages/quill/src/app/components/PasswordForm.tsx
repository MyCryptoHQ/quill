import { Body } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import { Label } from '@rebass/forms/styled-components';
import type { FormEvent, FunctionComponent } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, ref, string } from 'yup';
import zxcvbn from 'zxcvbn';

import warning from '@assets/icons/circle-warning.svg';
import { Box, Flex, FormError, FormInput, Image, List, ListItem } from '@components/index';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';

import { translate } from '../translations/translate';

const PW_SCORE_REQUIREMENT = 4;

const SCHEMA = object({
  password: string()
    .required(translateRaw('PASSWORD_EMPTY'))
    .test('strong-password', translateRaw('PASSWORD_TOO_WEAK'), (value) => {
      return zxcvbn(value).score >= PW_SCORE_REQUIREMENT;
    }),
  passwordConfirmation: string()
    .required(translateRaw('PASSWORD_EMPTY'))
    .is([ref('password')], translateRaw('PASSWORDS_NOT_EQUAL'))
});

export interface PasswordFormProps {
  onSubmit(password: string): void;
}

export const PasswordForm: FunctionComponent<PasswordFormProps> = ({ onSubmit }) => {
  const form = useForm(
    {
      password: '',
      passwordConfirmation: ''
    },
    yupValidator(SCHEMA),
    true
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      console.log(form.values, form.errorMap);
      return;
    }

    onSubmit(form.values.password);
  };

  return (
    <form onSubmit={handleSubmit} id="create-password-form">
      <Box width="100%" mt="3">
        <Label htmlFor="password">{translateRaw('ENTER_PASSWORD')}</Label>
        <FormInput id="password" name="password" type="password" form={form} />
        <FormError name="password" form={form} />
      </Box>
      <Box width="100%" mt="2" color="BLUE_GREY">
        <Body color="inherit">{translateRaw('PASSWORD_CRITERIA')}</Body>
        <List>
          <ListItem mb="0" color="inherit">
            {translateRaw('PASSWORD_CRITERIA_1')}
          </ListItem>
          <ListItem mb="0" color="inherit">
            {translateRaw('PASSWORD_CRITERIA_2')}
          </ListItem>
          <ListItem mb="0" color="inherit">
            {translateRaw('PASSWORD_CRITERIA_3')}
          </ListItem>
          <ListItem mb="0" color="inherit">
            {translateRaw('PASSWORD_CRITERIA_4')}
          </ListItem>
          <ListItem mb="0" color="inherit">
            {translateRaw('PASSWORD_CRITERIA_5')}
          </ListItem>
        </List>
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
  );
};
