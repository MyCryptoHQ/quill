import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { ROUTE_PATHS } from '@app/routing';
import { fetchAccount, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

const dPathBase = "m/44'/60'/0'/0";

export const AddAccountMnemonic = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [phrase, setPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [persistence, setPersistence] = useState(false);
  const [addresses, setAddresses] = useState<GetAddressesResult[]>([]);

  const changeMnemonicPhrase = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPhrase(e.currentTarget.value);

  const changePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.currentTarget.value);

  const changePersistence = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPersistence(e.currentTarget.checked);

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
    // @todo Handle persistence
    dispatch(
      fetchAccount({
        walletType: WalletType.MNEMONIC,
        mnemonicPhrase: phrase,
        passphrase: password,
        path: dPath
      })
    );
    history.replace(ROUTE_PATHS.HOME);
  };

  return (
    <>
      <label>
        Mnemonic Phrase
        <br />
        <input type="text" onChange={changeMnemonicPhrase} />
      </label>
      <br />
      <label>
        Password
        <br />
        <input type="text" onChange={changePassword} />
      </label>
      <br />
      <label>
        Persistence
        <input type="checkbox" onChange={changePersistence} checked={persistence} />
      </label>
      <br />
      <input type="submit" value="Next" onClick={handleSubmit} />
      {addresses.length > 0 && (
        <>
          <br />
          {addresses.map((address, index) => (
            <button key={index} onClick={() => addAddress(address)}>
              {address.address}
            </button>
          ))}
        </>
      )}
    </>
  );
};
