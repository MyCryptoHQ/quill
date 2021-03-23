import React, { FormEvent } from 'react';

import { boolean, object, refine, string } from 'superstruct';
import { FormError, useForm } from 'typed-react-form';

import { Body, Box, Button, FormCheckbox, FormInput, Image, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';
import { WalletType } from '@types';

const ADD_PRIVATE_KEY_STRUCT = object({
  privateKey: refine(string(), 'Not empty', (value) => {
    if (value.length > 0) {
      return true;
    }

    return translateRaw('PRIVATE_KEY_EMPTY');
  }),
  persistent: boolean()
});

export const AddAccountPrivateKey = () => {
  const form = useForm(
    {
      privateKey: '',
      persistent: true
    },
    getValidator(ADD_PRIVATE_KEY_STRUCT),
    true
  );
  const dispatch = useDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    dispatch(
      fetchAccounts([
        {
          walletType: WalletType.PRIVATE_KEY,
          privateKey: form.values.privateKey,
          persistent: form.values.persistent
        }
      ])
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        type="text"
        id="privateKey"
        name="privateKey"
        form={form}
        data-testid="private-key-input"
        placeholder={translateRaw('PRIVATE_KEY_PLACEHOLDER')}
      />
      <FormError name="privateKey" form={form} />
      <Box mt="2" variant="rowAlign">
        <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
        <Body>
          {translate('SECRET_WARNING', { $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP) })}
        </Body>
      </Box>
      <PanelBottom pb="24px">
        <Button type="submit">{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </form>
  );
};
