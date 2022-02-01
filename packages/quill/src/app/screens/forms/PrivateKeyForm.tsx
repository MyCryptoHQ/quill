import { Body } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';
import type { FormEvent, ReactNode } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import { Box, FormError, Image, PrivateKeyInput } from '@app/components';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { translate } from '@translations';

const SCHEMA = object({
  privateKey: string().required(translateRaw('PRIVATE_KEY_EMPTY'))
});

export const usePrivateKeyForm = () =>
  useForm(
    {
      privateKey: ''
    },
    yupValidator(SCHEMA),
    true
  );

export const PrivateKeyForm = ({
  onSubmit,
  form,
  children
}: {
  onSubmit(): void;
  form: ReturnType<typeof usePrivateKeyForm>;
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
    <form onSubmit={handleSubmit} id="private-key-form">
      <PrivateKeyInput
        id="privateKey"
        name="privateKey"
        form={form}
        data-testid="private-key-input"
        placeholder={translateRaw('PRIVATE_KEY_PLACEHOLDER')}
      />
      <FormError name="privateKey" form={form} />
      <Box mt="2" variant="horizontal-start">
        <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
        <Body>
          {translate('SECRET_WARNING', { $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP) })}
        </Body>
      </Box>
      {children}
    </form>
  );
};
