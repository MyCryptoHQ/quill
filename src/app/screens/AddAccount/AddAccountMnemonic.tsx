import React, { useState } from 'react';

import { Box, Button, Input, PanelBottom, Textarea } from '@app/components';
import { fetchAccount, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@translations';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

const dPathBase = "m/44'/60'/0'/0";

export const AddAccountMnemonic = () => {
  const dispatch = useDispatch();
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [persistent, setPersistent] = useState(false);
  const [addresses, setAddresses] = useState<GetAddressesResult[]>([]);

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistent(e.currentTarget.checked);

  const handleSubmit = async () => {
    const result = await ipcBridgeRenderer.crypto.invoke({
      type: CryptoRequestType.GET_ADDRESSES,
      wallet: {
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: phrase,
        passphrase: password
      },
      path: dPathBase,
      limit: 10,
      offset: 0
    });
    setAddresses((result as unknown) as GetAddressesResult[]);
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
        <Button onClick={handleSubmit}>{translateRaw('NEXT')}</Button>
      </PanelBottom>
      {addresses.length > 0 && (
        <>
          <br />
          {addresses.map((address) => (
            <button key={address.dPath} onClick={() => addAddress(address)}>
              {address.address}
            </button>
          ))}
        </>
      )}
    </>
  );
};
