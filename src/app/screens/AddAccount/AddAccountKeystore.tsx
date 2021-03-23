import React, { FormEvent } from 'react';

import { boolean, instance, object, refine, string } from 'superstruct';
import { FormError, useForm } from 'typed-react-form';

import {
  Body,
  Box,
  Button,
  FileBox,
  FormCheckbox,
  FormInput,
  Image,
  PanelBottom
} from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';
import { WalletType } from '@types';

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

export const AddAccountKeystore = () => {
  const form = useForm(
    {
      keystore: undefined,
      password: '',
      persistent: true
    },
    getValidator(ADD_KEYSTORE_STRUCT),
    true
  );
  const dispatch = useDispatch();

  const changeKeystore = (f: File) => form.setValue('keystore', f);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }
    // @todo Handle errors
    form.values.keystore.text().then((keystore) => {
      dispatch(
        fetchAccounts([
          {
            walletType: WalletType.KEYSTORE,
            keystore,
            password: form.values.password,
            persistent: form.values.persistent
          }
        ])
      );
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb="150px">
        <FileBox my="2" onChange={changeKeystore} />
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
