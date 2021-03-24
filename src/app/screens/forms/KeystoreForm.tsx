import React, { FormEvent, ReactNode } from 'react';

import { boolean, instance, object, refine, string } from 'superstruct';
import { useForm } from 'typed-react-form';

import { Body, Box, FileBox, FormError, FormInput, Image } from '@app/components';
import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';

const ADD_KEYSTORE_STRUCT = object({
  keystore: refine(instance(File), 'Not empty', (value) => {
    if (value) {
      return true;
    }

    return translateRaw('KEYSTORE_EMPTY');
  }),
  password: refine(string(), 'Not empty', (value) => {
    if (value.length > 0) {
      return true;
    }

    return translateRaw('PASSWORD_EMPTY');
  }),
  persistent: boolean()
});

export const useKeystoreForm = () =>
  useForm(
    {
      keystore: undefined,
      password: '',
      persistent: true
    },
    getValidator(ADD_KEYSTORE_STRUCT),
    true
  );

export const KeystoreForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof useKeystoreForm>;
  children: ReactNode;
}) => {
  const changeKeystore = (f: File) => form.setValue('keystore', f);

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
        <FileBox my="2" onChange={changeKeystore} />
        <FormError name="keystore" form={form} />
        <Box mt="2">
          <label>
            {translateRaw('KEYSTORE_PASSWORD')}
            <FormInput
              name="password"
              id="password"
              form={form}
              type="text"
              placeholder={translateRaw('KEYSTORE_PASSWORD_PLACEHOLDER')}
              mt="2"
            />
            <FormError name="password" form={form} />
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
