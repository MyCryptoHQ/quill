import React, { useEffect, useState } from 'react';

import { DPathsList } from '@data';

import {
  Body,
  Box,
  Button,
  Checkbox,
  DPathSelector,
  Image,
  Input,
  MnemonicAddressList,
  PanelBottom,
  Textarea
} from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import warning from '@assets/icons/circle-warning.svg';
import { ipcBridgeRenderer } from '@bridge';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { translate, translateRaw } from '@translations';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

const ADDRESSES_PER_PAGE = 10;

export const AddAccountMnemonic = () => {
  const dispatch = useDispatch();
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [dPath, setDPath] = useState<keyof typeof DPathsList>('ETH_DEFAULT');
  const [persistent, setPersistent] = useState(true);
  const [offset, setOffset] = useState(0);
  const [addresses, setAddresses] = useState<GetAddressesResult[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const togglePersistence = () => setPersistent(!persistent);

  const updateAddresses = async () => {
    const result = await ipcBridgeRenderer.crypto.invoke({
      type: CryptoRequestType.GET_ADDRESSES,
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: phrase,
        passphrase: password
      },
      path: DPathsList[dPath].value,
      limit: ADDRESSES_PER_PAGE,
      offset
    });
    setAddresses((result as unknown) as GetAddressesResult[]);
  };

  useEffect(() => {
    if (phrase.length > 0) {
      updateAddresses();
    }
  }, [dPath, offset]);

  const handleDPathChange = (path: keyof typeof DPathsList) => setDPath(path);

  const handlePrevious = () => setOffset(offset - ADDRESSES_PER_PAGE);

  const handleNext = () => setOffset(offset + ADDRESSES_PER_PAGE);

  const toggleSelectedAccount = (account: GetAddressesResult) => {
    if (selectedAccounts.some((a) => a === account.dPath)) {
      setSelectedAccounts(selectedAccounts.filter((a) => a !== account.dPath));
    } else {
      setSelectedAccounts([...selectedAccounts, account.dPath]);
    }
  };

  const handleSubmit = async () => {
    dispatch(
      fetchAccounts(
        selectedAccounts.map((path) => ({
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: phrase,
          passphrase: password,
          path,
          persistent
        }))
      )
    );
  };

  return (
    <>
      {addresses.length === 0 ? (
        <>
          <Box mb="150px">
            <Textarea
              data-testid="mnemonic-input"
              onChange={changeMnemonicPhrase}
              placeholder={translateRaw('MNEMONIC_PHRASE_PLACEHOLDER')}
              sx={{ resize: 'none', height: '140px' }}
              my="2"
            />
            <Box mt="1">
              <label>
                {translateRaw('MNEMONIC_PASSWORD')}
                <Input
                  type="text"
                  onChange={changePassword}
                  placeholder={translateRaw('MNEMONIC_PASSWORD_PLACEHOLDER')}
                  mt="2"
                />
              </label>
            </Box>
            <Box mt="2" variant="rowAlign">
              <Image
                src={warning}
                width="20px"
                height="20px"
                minWidth="20px"
                alt="Warning"
                mr="2"
              />
              <Body>
                {translate('SECRET_WARNING', {
                  $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
                })}
              </Body>
            </Box>
          </Box>
          <PanelBottom pb="24px">
            <Button onClick={updateAddresses}>{translateRaw('NEXT')}</Button>
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
      ) : (
        <>
          <Box mb="150px">
            <DPathSelector selectedPath={dPath} setSelectedPath={handleDPathChange} />
            <MnemonicAddressList
              addresses={addresses}
              selectedAccounts={selectedAccounts}
              toggleSelectedAccount={toggleSelectedAccount}
            />
            <Box variant="rowAlign" my="2">
              <Button mr="2" onClick={handlePrevious} disabled={offset === 0} variant="inverted">
                {translateRaw('PREVIOUS')}
              </Button>
              <Button ml="2" onClick={handleNext} variant="inverted">
                {translateRaw('NEXT')}
              </Button>
            </Box>
          </Box>
          <PanelBottom pb="24px">
            <Button onClick={handleSubmit} disabled={selectedAccounts.length === 0}>
              {translateRaw('SUBMIT')}
            </Button>
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
      )}
    </>
  );
};
