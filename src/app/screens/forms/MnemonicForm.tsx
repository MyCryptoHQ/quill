import React, { FormEvent, ReactNode } from 'react';

import { boolean, object, refine, string } from 'superstruct';
import { DefaultState, useForm } from 'typed-react-form';

import { Body, Box, FormError, FormInput, FormTextArea, Image } from '@app/components';
import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';

const ADD_MNEMONIC_STRUCT = object({
  mnemonic: refine(string(), 'Not empty', (value) => {
    if (value.length > 0) {
      return true;
    }

    return translateRaw('MNEMONIC_EMPTY');
  }),
  password: string(),
  persistent: boolean()
});

export const useMnemonicForm = <T extends DefaultState>(defaultState?: T) =>
  useForm(
    {
      mnemonic: '',
      password: '',
      persistent: true
    },
    getValidator(ADD_MNEMONIC_STRUCT),
    true,
    false,
    defaultState
  );

export const MnemonicForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof useMnemonicForm>;
  children: ReactNode;
}) => {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb="150px">
        <FormTextArea
          data-testid="mnemonic-input"
          name="mnemonic"
          id="mnemonic"
          form={form}
          placeholder={translateRaw('MNEMONIC_PHRASE_PLACEHOLDER')}
          sx={{ resize: 'none', height: '140px' }}
          my="2"
        />
        <FormError name="mnemonic" form={form} />
        <Box mt="1">
          <label>
            {translateRaw('MNEMONIC_PASSWORD')}
            <FormInput
              type="text"
              id="password"
              name="password"
              form={form}
              placeholder={translateRaw('MNEMONIC_PASSWORD_PLACEHOLDER')}
              mt="2"
            />
          </label>
        </Box>
        <Box mt="2" variant="rowAlign">
          <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
          <Body>
            {translate('SECRET_WARNING', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
            })}
          </Body>
        </Box>
      </Box>
      {children}
    </form>
  );
};
