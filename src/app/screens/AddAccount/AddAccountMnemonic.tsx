import React, { useEffect } from 'react';

import { AnyListener } from 'typed-react-form';

import {
  Body,
  Box,
  Button,
  Container,
  DPathSelector,
  FormCheckbox,
  MnemonicAddressList,
  PanelBottom,
  WalletTypeSelector,
  Wrapper
} from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { DPathsList } from '@data';
import { translateRaw } from '@translations';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../forms/MnemonicForm';

const ADDRESSES_PER_PAGE = 10;

const useForm = () =>
  useMnemonicForm({
    offset: 0,
    dPath: 'ETH_DEFAULT' as keyof typeof DPathsList,
    addresses: [] as GetAddressesResult[],
    selectedAccounts: [] as string[],
    isSubmitting: false
  });

interface Props {
  setWalletType(walletType: WalletType): void;
}

export const AddAccountMnemonic = ({ setWalletType }: Props) => {
  const form = useForm();

  return (
    <AnyListener
      form={form}
      render={(form) => <AddAccountMnemonicForm form={form} setWalletType={setWalletType} />}
    />
  );
};

const AddAccountMnemonicForm = ({
  form,
  setWalletType
}: { form: ReturnType<typeof useForm> } & Props) => {
  const dispatch = useDispatch();
  const { offset, dPath, addresses, selectedAccounts } = form.state;

  const updateAddresses = async () => {
    try {
      const result: GetAddressesResult[] = await ipcBridgeRenderer.crypto.invoke({
        type: CryptoRequestType.GET_ADDRESSES,
        wallet: {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: form.values.mnemonic,
          passphrase: form.values.password
        },
        path: DPathsList[dPath].value,
        limit: ADDRESSES_PER_PAGE,
        offset
      });
      form.setState({ ...form.state, addresses: result });
    } catch (err) {
      form.setError('mnemonic', err.message);
    }
  };

  useEffect(() => {
    if (form.values.mnemonic.length > 0) {
      updateAddresses();
    }
  }, [dPath, offset]);

  const handleDPathChange = (dPath: keyof typeof DPathsList) =>
    form.setState({ ...form.state, dPath });

  const handlePrevious = () =>
    form.setState({ ...form.state, offset: offset - ADDRESSES_PER_PAGE });

  const handleNext = () => form.setState({ ...form.state, offset: offset + ADDRESSES_PER_PAGE });

  const toggleSelectedAccount = (account: GetAddressesResult) => {
    if (selectedAccounts.some((a) => a === account.dPath)) {
      form.setState({
        ...form.state,
        selectedAccounts: selectedAccounts.filter((a) => a !== account.dPath)
      });
    } else {
      form.setState({ ...form.state, selectedAccounts: [...selectedAccounts, account.dPath] });
    }
  };

  const handleSubmit = async () => {
    dispatch(
      fetchAccounts(
        selectedAccounts.map((path) => ({
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: form.values.mnemonic,
          passphrase: form.values.password,
          path,
          persistent: form.values.persistent
        }))
      )
    );
  };

  return (
    <>
      <Wrapper>
        <Container>
          <WalletTypeSelector walletType={WalletType.MNEMONIC} setWalletType={setWalletType} />

          {addresses.length === 0 ? (
            <MnemonicForm form={form} onSubmit={updateAddresses} />
          ) : (
            <Box>
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
          )}
        </Container>
      </Wrapper>
      {addresses.length === 0 ? (
        <PanelBottom pb="24px">
          <Button type="submit" form="mnemonic-phrase-form">
            {translateRaw('NEXT')}
          </Button>
          <Box pt="2" variant="rowAlign">
            <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
            <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
          </Box>
        </PanelBottom>
      ) : (
        <PanelBottom pb="24px">
          <Button onClick={handleSubmit} disabled={selectedAccounts.length === 0}>
            {translateRaw('SUBMIT')}
          </Button>
          <Box pt="2" variant="rowAlign">
            <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
            <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
          </Box>
        </PanelBottom>
      )}
    </>
  );
};
