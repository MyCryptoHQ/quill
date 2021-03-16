import React, { ChangeEventHandler, useEffect, useState } from 'react';

import { DPathsList } from '@data';

import {
  Box,
  Button,
  DPathSelector,
  Input,
  MnemonicAddressList,
  PanelBottom,
  Textarea
} from '@app/components';
import { fetchAccount, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@translations';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

export const AddAccountMnemonic = () => {
  const dispatch = useDispatch();
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [dPath, setDPath] = useState<keyof typeof DPathsList>('ETH_DEFAULT');
  const [persistent, setPersistent] = useState(false);
  const [addresses, setAddresses] = useState<GetAddressesResult[]>([]);
  const [selectedPaths, setSelectedPaths] = useState([]);

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistent(e.currentTarget.checked);

  const updateAddresses = async () => {
    const result = await ipcBridgeRenderer.crypto.invoke({
      type: CryptoRequestType.GET_ADDRESSES,
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: phrase,
        passphrase: password
      },
      path: DPathsList[dPath].value,
      limit: 10,
      offset: 0
    });
    setAddresses((result as unknown) as GetAddressesResult[]);
  };

  useEffect(() => {
    updateAddresses();
  }, [dPath]);

  const handleDPathChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setDPath(e.currentTarget.value as keyof typeof DPathsList);

  const handleSubmit = async () => {
    // @todo Add
  };

  const addAddress = ({ dPath }: GetAddressesResult) => {
    dispatch(
      fetchAccount({
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: phrase,
        passphrase: password,
        path: dPath,
        persistent
      })
    );
  };

  return (
    <>
      {addresses.length === 0 ? (
        <>
          <Box>
            <label>
              {translateRaw('MNEMONIC_PHRASE')}
              <Textarea onChange={changeMnemonicPhrase} />
            </label>
          </Box>
          <Box>
            <label>
              {translateRaw('PASSWORD')}
              <Input type="text" onChange={changePassword} />
            </label>
          </Box>
          <Box>
            <label>
              {translateRaw('PERSISTENCE')}
              <input type="checkbox" onChange={changePersistence} checked={persistent} />
            </label>
          </Box>
          <PanelBottom>
            <Button onClick={updateAddresses}>{translateRaw('NEXT')}</Button>
          </PanelBottom>
        </>
      ) : (
        <>
          <Box mb="130px">
            <DPathSelector selectedPath={dPath} setSelectedPath={handleDPathChange} />
            <MnemonicAddressList
              addresses={addresses}
              selectedPaths={selectedPaths}
              setSelectedPaths={setSelectedPaths}
            />
            <Box variant="rowAlign" my="2">
              <Button mr="2">{translateRaw('PREVIOUS')}</Button>
              <Button ml="2">{translateRaw('NEXT')}</Button>
            </Box>
          </Box>
          <PanelBottom>
            <Button onClick={handleSubmit}>{translateRaw('SUBMIT')}</Button>
          </PanelBottom>
        </>
      )}
    </>
  );
};
