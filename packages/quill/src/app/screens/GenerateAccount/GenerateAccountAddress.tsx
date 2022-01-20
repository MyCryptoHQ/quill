import { BlockieAddress, Body, Button, SubHeading, Tooltip } from '@mycrypto/ui';
import { getGeneratedAccount, setGeneratedAccountPersistent, translateRaw } from '@quill/common';
import React, { useState } from 'react';

import type { IFlowComponentProps } from '@components';
import { Box, Checkbox, Container, Link, Panel, PanelBottom } from '@components';
import { DEFAULT_DERIVATION_PATH } from '@config/derivation';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

export const GenerateAccountAddress = ({ flowHeader, onNext }: IFlowComponentProps) => {
  const [showMnemonicPhrase, setShowMnemonicPhrase] = useState(false);
  const { address, mnemonicPhrase, persistent } = useSelector(getGeneratedAccount);
  const dispatch = useDispatch();

  const handleToggle = () => dispatch(setGeneratedAccountPersistent(!persistent));
  const handleClick = () => setShowMnemonicPhrase(!showMnemonicPhrase);

  return (
    <>
      <Container>
        {flowHeader}
        <Box sx={{ textAlign: 'center' }} mb="3">
          <SubHeading>{translateRaw('NEW_ACCOUNT_TITLE')}</SubHeading>
        </Box>
        <Body>{translateRaw('GENERATE_ACCOUNT_NOTICE')}</Body>
        <Panel mt="3">
          <Body fontSize="2" mb="2">
            {translate('RECOVERY_PHRASE_SECRET')}{' '}
            {showMnemonicPhrase ? (
              <Body fontSize="2">
                {mnemonicPhrase}{' '}
                <Link variant="defaultLink" onClick={handleClick}>
                  {translate('CLICK_TO_HIDE')}
                </Link>
              </Body>
            ) : (
              <Link variant="defaultLink" onClick={handleClick}>
                {translate('CLICK_TO_SHOW')}
              </Link>
            )}
          </Body>
          <Body fontSize="2" mb="1">
            {translate('ADDRESS')}
          </Body>
          <BlockieAddress address={address} mb="2" />
          <Body fontSize="2">
            {translate('DERIVATION_PATH')} {DEFAULT_DERIVATION_PATH}
          </Body>
        </Panel>
        <Box pt="2" variant="horizontal-start">
          <Checkbox checked={persistent} onChange={handleToggle} data-testid="toggle-persistence" />
          <Body pl="2">
            {translateRaw('PERSISTENCE_CHECKBOX')}
            <Tooltip
              icon="info"
              fill="LIGHT_BLUE"
              tooltip={translateRaw('PERSISTENCE_CHECKBOX_TOOLTIP')}
              ml="1"
            />
          </Body>
        </Box>
      </Container>
      <PanelBottom variant="clear">
        <Button onClick={onNext}>{translateRaw('NEXT')}</Button>
      </PanelBottom>
    </>
  );
};
