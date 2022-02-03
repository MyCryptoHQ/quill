import { Body } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import type { FormEvent, ReactNode } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { mixed, object, string } from 'yup';

import { Box, FormError, FormFileInput, FormInput, Image } from '@app/components';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate } from '@translations';

const SCHEMA = object({
  keystore: mixed().required(translateRaw('KEYSTORE_EMPTY')),
  password: string().required(translateRaw('PASSWORD_EMPTY'))
});

export const useKeystoreForm = () =>
  useForm(
    {
      keystore: undefined as File | undefined,
      password: ''
    },
    yupValidator(SCHEMA, { abortEarly: false }),
    true
  );

export const KeystoreForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof useKeystoreForm>;
  children?: ReactNode;
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
    <form onSubmit={handleSubmit} id="keystore-form">
      <Box>
        <FormFileInput name="keystore" form={form} mb="2" />
        <FormError name="keystore" form={form} />
        <Box mt="2">
          <label>
            {translateRaw('KEYSTORE_PASSWORD')}
            <FormInput
              name="password"
              id="password"
              form={form}
              type="password"
              placeholder={translateRaw('KEYSTORE_PASSWORD_PLACEHOLDER')}
              mt="2"
            />
            <FormError name="password" form={form} />
          </label>
        </Box>
        <Box mt="2" variant="horizontal-start">
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
