import React, { FormEvent, useEffect } from 'react';

import { boolean, Infer, object, refine, string } from 'superstruct';
import { AnyListener, DefaultState, FormState, useForm } from 'typed-react-form';

import {
  Body,
  Box,
  Button,
  DPathSelector,
  FormCheckbox,
  FormError,
  FormInput,
  FormTextArea,
  Image,
  MnemonicAddressList,
  PanelBottom
} from '@app/components';
import { fetchAccounts, useDispatch } from '@app/store';
import { getValidator } from '@app/utils';
import warning from '@assets/icons/circle-warning.svg';
import { ipcBridgeRenderer } from '@bridge';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { DPathsList } from '@data';
import { translate, translateRaw } from '@translations';
import { CryptoRequestType, GetAddressesResult, WalletType } from '@types';

const ADDRESSES_PER_PAGE = 10;

const ADD_MNEMONIC_STRUCT = object({
  mnemonic: refine(string(), 'Not empty', (value) => {
    if (value.length > 0) {
      return true;
    }

    return translateRaw('MNEMONIC_EMPTY');
  }),
  password: string(),
  persistent: boolean()
});

export const AddAccountMnemonic = () => {
  const form = useForm(
    {
      mnemonic: '',
      password: '',
      persistent: true
    },
    getValidator(ADD_MNEMONIC_STRUCT),
    true,
    false,
    {
      offset: 0,
      dPath: 'ETH_DEFAULT' as keyof typeof DPathsList,
      addresses: [] as GetAddressesResult[],
      selectedAccounts: [] as string[],
      isSubmitting: false
    }
  );

  return <AnyListener form={form} render={(form) => <AddAccountMnemonicForm form={form} />} />;
};

const AddAccountMnemonicForm = ({
  form
}: {
  form: FormState<
    Infer<typeof ADD_MNEMONIC_STRUCT>,
    {
      offset: number;
      dPath: keyof typeof DPathsList;
      addresses: GetAddressesResult[];
      selectedAccounts: string[];
    } & DefaultState
  >;
}) => {
  const dispatch = useDispatch();
  const { offset, dPath, addresses, selectedAccounts } = form.state;

  const updateAddresses = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    await form.validate();
    if (form.error) {
      return;
    }
    const result = await ipcBridgeRenderer.crypto.invoke({
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
    form.setState({ ...form.state, addresses: (result as unknown) as GetAddressesResult[] });
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
      {addresses.length === 0 ? (
        <form onSubmit={updateAddresses}>
          <Box mb="150px">
            <FormTextArea
              data-testid="mnemonic-input"
              name="mnemonic"
              id="mnemonic"
              form={form}
              placeholder={translateRaw('MNEMONIC_PHRASE_PLACEHOLDER')}
              sx={{ resize: 'none', height: '140px' }}
              my="2"
            />
            <FormError name="mnemonic" form={form} />
            <Box mt="1">
              <label>
                {translateRaw('MNEMONIC_PASSWORD')}
                <FormInput
                  type="text"
                  id="password"
                  name="password"
                  form={form}
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
            <Button type="submit">{translateRaw('NEXT')}</Button>
            <Box pt="2" variant="rowAlign">
              <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
              <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
            </Box>
          </PanelBottom>
        </form>
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
              <FormCheckbox name="persistent" form={form} data-testid="toggle-persistence" />
              <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
            </Box>
          </PanelBottom>
        </>
      )}
    </>
  );
};
