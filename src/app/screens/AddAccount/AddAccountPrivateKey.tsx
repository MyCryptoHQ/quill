import React, { useState } from 'react';

import { Body, Box, Button, Checkbox, Image, Input, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountPrivateKey = () => {
  const dispatch = useDispatch();
  const [privateKey, setPrivateKey] = useState('');
  const [persistent, setPersistent] = useState(true);

  const changePrivateKey = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPrivateKey(e.currentTarget.value);

  const togglePersistence = () => setPersistent(!persistent);

  const handleSubmit = () => {
    dispatch(fetchAccounts([{ walletType: WalletType.PRIVATE_KEY, privateKey, persistent }]));
  };

  return (
    <>
      <Input
        type="text"
        data-testid="private-key-input"
        onChange={changePrivateKey}
        placeholder={translateRaw('PRIVATE_KEY_PLACEHOLDER')}
      />
      <Box mt="2" variant="rowAlign">
        <Image src={warning} width="20px" height="20px" minWidth="20px" alt="Warning" mr="2" />
        <Body>
          {translate('SECRET_WARNING', { $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP) })}
        </Body>
      </Box>
      <PanelBottom pb="24px">
        <Button onClick={handleSubmit}>{translateRaw('SUBMIT')}</Button>
        <Box pt="2" variant="rowAlign">
          <Checkbox
            onChange={togglePersistence}
            checked={persistent}
            data-testid="toggle-persistence"
          />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
