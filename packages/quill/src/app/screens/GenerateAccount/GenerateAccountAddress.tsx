import { BlockieAddress, Body, Button, Heading } from '@mycrypto/ui';
import { getGeneratedAccount, translateRaw } from '@quill/common';
import React, { useState } from 'react';

import type { IFlowComponentProps } from '@components';
import { Box, Container, Link, Panel, PanelBottom } from '@components';
import { DEFAULT_DERIVATION_PATH } from '@config/derivation';
import { useSelector } from '@store';
import { translate } from '@translations';

export const GenerateAccountAddress = ({ flowHeader, onNext }: IFlowComponentProps) => {
  const [showMnemonicPhrase, setShowMnemonicPhrase] = useState(false);
  const { address, mnemonicPhrase } = useSelector(getGeneratedAccount);

  const handleClick = () => setShowMnemonicPhrase(!showMnemonicPhrase);

  return (
    <>
      <Container>
        {flowHeader}
        <Box sx={{ textAlign: 'center' }} mb="3">
          <Heading fontSize="24px" lineHeight="150%">
            {translateRaw('NEW_ACCOUNT_TITLE')}
          </Heading>
        </Box>
        <Body>{translateRaw('GENERATE_ACCOUNT_NOTICE')}</Body>
        <Panel mt="3">
          <Body fontSize="14px" mb="2">
            {translate('RECOVERY_PHRASE_SECRET')}{' '}
            {showMnemonicPhrase ? (
              <Body fontSize="14px">
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
          <Body fontSize="14px" mb="1">
            {translate('ADDRESS')}
          </Body>
          <BlockieAddress address={address} mb="2" />
          <Body fontSize="14px">
            {translate('DERIVATION_PATH')} {DEFAULT_DERIVATION_PATH}
          </Body>
        </Panel>
      </Container>
      <PanelBottom variant="clear">
        <Button onClick={onNext}>{translateRaw('NEXT')}</Button>
      </PanelBottom>
    </>
  );
};
