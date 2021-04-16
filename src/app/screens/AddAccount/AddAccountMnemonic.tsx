import { Body } from '@mycrypto/ui';
import { ALL_DERIVATION_PATHS, DEFAULT_ETH } from '@mycrypto/wallets';
import { useEffect } from 'react';
import { AnyListener } from 'typed-react-form';

import {
  Box,
  Button,
  DPathSelector,
  FormCheckbox,
  MnemonicAddressList,
  PanelBottom,
  ScrollableContainer,
  WalletTypeSelector
} from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { ipcBridgeRenderer } from '@bridge';
import { translateRaw } from '@common/translate';
import type { GetAddressesResult } from '@types';
import { CryptoRequestType, WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../forms/MnemonicForm';

const ADDRESSES_PER_PAGE = 10;

const useForm = () =>
  useMnemonicForm({
    offset: 0,
    dPath: DEFAULT_ETH.name,
    addresses: [] as GetAddressesResult[],
    selectedAccounts: [] as number[],
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
  const selectedPathData = ALL_DERIVATION_PATHS.find((p) => p.name === dPath);

  const updateAddresses = async () => {
    try {
      const result: GetAddressesResult[] = await ipcBridgeRenderer.crypto.invoke({
        type: CryptoRequestType.GET_ADDRESSES,
        wallet: {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: form.values.mnemonic,
          passphrase: form.values.password
        },
        path: selectedPathData,
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

  const handleDPathChange = (dPath: string) =>
    form.setState({ ...form.state, dPath, selectedAccounts: [] });

  const handlePrevious = () =>
    form.setState({ ...form.state, offset: offset - ADDRESSES_PER_PAGE });

  const handleNext = () => form.setState({ ...form.state, offset: offset + ADDRESSES_PER_PAGE });

  const toggleSelectedAccount = (account: GetAddressesResult) => {
    if (selectedAccounts.some((a) => a === account.index)) {
      form.setState({
        ...form.state,
        selectedAccounts: selectedAccounts.filter((a) => a !== account.index)
      });
    } else {
      form.setState({ ...form.state, selectedAccounts: [...selectedAccounts, account.index] });
    }
  };

  const handleSubmit = async () => {
    dispatch(
      fetchAccounts(
        selectedAccounts.map((index) => ({
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: form.values.mnemonic,
          passphrase: form.values.password,
          path: selectedPathData,
          index,
          persistent: form.values.persistent
        }))
      )
    );
  };

  return (
    <>
      <ScrollableContainer>
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
            <Box variant="horizontal-start" my="2">
              <Button mr="2" onClick={handlePrevious} disabled={offset === 0} variant="inverted">
                {translateRaw('PREVIOUS')}
              </Button>
              <Button ml="2" onClick={handleNext} variant="inverted">
                {translateRaw('NEXT')}
              </Button>
            </Box>
          </Box>
        )}
      </ScrollableContainer>
      {addresses.length === 0 ? (
        <PanelBottom pb="24px">
          <Button type="submit" form="mnemonic-phrase-form">
            {translateRaw('NEXT')}
          </Button>
          <Box pt="2" variant="horizontal-start">
            <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
            <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
          </Box>
        </PanelBottom>
      ) : (
        <PanelBottom pb="24px">
          <Button onClick={handleSubmit} disabled={selectedAccounts.length === 0}>
            {translateRaw('SUBMIT')}
          </Button>
          <Box pt="2" variant="horizontal-start">
            <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
            <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
          </Box>
        </PanelBottom>
      )}
    </>
  );
};
