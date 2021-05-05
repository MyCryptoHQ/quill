import { BlockieAddress, Body, Button, Heading } from '@mycrypto/ui';
import React, { useState } from 'react';

import { addSavedAccounts, getAccountsToAdd } from '@common/store';
import { setAccountsToAdd } from '@common/store/accounts.slice';
import { translateRaw } from '@common/translate';
import { Box, Checkbox, Container, Panel, PanelBottom } from '@components';
import { DEFAULT_DERIVATION_PATH } from '@config';
import { useUnmount } from '@hooks';
import { useDispatch, useSelector } from '@store';
import { WalletType } from '@types';

import { translate } from '../../../translations/translate';

export const AddAccountBackup = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccountsToAdd);
  const [persistent, setPersistent] = useState(true);

  const handleToggle = () => setPersistent((value) => !value);

  const handleAdd = () => {
    dispatch(addSavedAccounts(persistent));
  };

  useUnmount(() => {
    dispatch(setAccountsToAdd([]));
  });

  return (
    <>
      <Container>
        <Heading as="h2" fontSize="24px" lineHeight="36px" my="1" textAlign="center">
          Backup Recovery Phrase
        </Heading>
        <Body mb="2">
          Before continuing, ensure that you backup the secret phrase for your new wallet to reduce
          your risk of loss. If you'd like, download/print your paper wallet below. Read more
        </Body>
        <Panel mb="4">
          <Body fontSize="14px" mb="1">
            {translate('ADDRESS')}
          </Body>
          <BlockieAddress address={accounts[0].address} mb="2" />
          {accounts[0].walletType === WalletType.MNEMONIC && (
            <Body fontSize="14px">
              {translate('DERIVATION_PATH')} {DEFAULT_DERIVATION_PATH}
            </Body>
          )}
        </Panel>
      </Container>
      <PanelBottom variant="clear">
        <Button mb="2">Print Paper Wallet</Button>
        <Button mb="2" variant="inverted" onClick={handleAdd}>
          My Phrase is Stored Safely, Add Account
        </Button>
        <Box pt="2" variant="horizontal-start">
          <Checkbox checked={persistent} onChange={handleToggle} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
