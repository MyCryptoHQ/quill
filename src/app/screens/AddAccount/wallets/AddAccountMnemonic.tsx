import { Button } from '@mycrypto/ui';
import { ALL_DERIVATION_PATHS, DEFAULT_ETH } from '@mycrypto/wallets';
import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { AnyListener } from 'typed-react-form';

import {
  Box,
  DPathSelector,
  MnemonicAddressList,
  PanelBottom,
  ScrollableContainer,
  WalletTypeSelector
} from '@app/components';
import { useDispatch, useSelector } from '@app/store';
import { fetchAccounts, fetchAddresses, getAccountError, getAddresses } from '@common/store';
import { translateRaw } from '@common/translate';
import type { GetAddressesResult } from '@types';
import { WalletType } from '@types';

import { MnemonicForm, useMnemonicForm } from '../../forms/MnemonicForm';

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
  flowHeader: ReactElement;
  setWalletType(walletType: WalletType): void;
}

export const AddAccountMnemonic = (props: Props) => {
  const form = useForm();

  return (
    <AnyListener form={form} render={(form) => <AddAccountMnemonicForm form={form} {...props} />} />
  );
};

const AddAccountMnemonicForm = ({
  flowHeader,
  form,
  setWalletType
}: { form: ReturnType<typeof useForm> } & Props) => {
  const dispatch = useDispatch();
  const { offset, dPath, addresses, selectedAccounts } = form.state;
  const selectedPathData = ALL_DERIVATION_PATHS.find((p) => p.name === dPath);
  const derivedAddresses = useSelector(getAddresses);
  const fetchError = useSelector(getAccountError);

  const updateAddresses = async () => {
    dispatch(
      fetchAddresses({
        wallet: {
          walletType: WalletType.MNEMONIC,
          mnemonicPhrase: form.values.mnemonic,
          passphrase: form.values.password
        },
        path: selectedPathData,
        limit: ADDRESSES_PER_PAGE,
        offset
      })
    );
  };

  useEffect(() => {
    form.setState({ ...form.state, addresses: derivedAddresses });
  }, [derivedAddresses]);

  useEffect(() => {
    form.setError('mnemonic', fetchError);
  }, [fetchError]);

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
          index
        }))
      )
    );
  };

  return (
    <>
      <ScrollableContainer>
        {flowHeader}
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
      <PanelBottom>
        {addresses.length === 0 ? (
          <Button type="submit" form="mnemonic-phrase-form">
            {translateRaw('NEXT')}
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={selectedAccounts.length === 0}>
            {translateRaw('VERIFY_ACCOUNT')}
          </Button>
        )}
      </PanelBottom>
    </>
  );
};
