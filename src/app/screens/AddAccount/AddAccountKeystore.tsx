import React, { useState } from 'react';

import { Body, Box, Button, Checkbox, FileBox, Image, Input, PanelBottom } from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import warning from '@assets/icons/circle-warning.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';
import { WalletType } from '@types';

export const AddAccountKeystore = () => {
  const dispatch = useDispatch();
  const [keystoreFile, setKeystoreFile] = useState<File>();
  const [password, setPassword] = useState('');
  const [persistent, setPersistent] = useState(true);

  const changeKeystore = (f: File) => setKeystoreFile(f);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const togglePersistence = () => setPersistent(!persistent);

  const handleSubmit = () => {
    // @todo Handle errors
    keystoreFile.text().then((keystore) => {
      dispatch(
        fetchAccounts([{ walletType: WalletType.KEYSTORE, keystore, password, persistent }])
      );
    });
  };

  return (
    <>
      <Box mb="150px">
        <FileBox my="2" onChange={changeKeystore} />
        <Box mt="2">
          <label>
            {translateRaw('KEYSTORE_PASSWORD')}
            <Input
              type="text"
              onChange={changePassword}
              value={password}
              placeholder={translateRaw('KEYSTORE_PASSWORD_PLACEHOLDER')}
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
