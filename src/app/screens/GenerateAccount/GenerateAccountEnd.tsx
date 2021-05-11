import { BlockieAddress, Body, Button, Heading } from '@mycrypto/ui';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';

import { getGeneratedAccount } from '@common/store';
import { translateRaw } from '@common/translate';
import type { IFlowComponentProps } from '@components';
import { Box, Container, Link, Panel, PanelBottom, PaperWallet } from '@components';
import { DEFAULT_DERIVATION_PATH } from '@config/derivation';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { useSelector } from '@store';
import { translate } from '@translations';
import { WalletType } from '@types';

export const GenerateAccountEnd = ({ onNext, flowHeader }: IFlowComponentProps) => {
  const paperWallet = useRef<HTMLDivElement>();
  const [showMnemonicPhrase, setShowMnemonicPhrase] = useState(false);
  const [paperWalletImage, setPaperWalletImage] = useState<string>();
  const { address, mnemonicPhrase } = useSelector(getGeneratedAccount);

  const handleClick = () => setShowMnemonicPhrase(!showMnemonicPhrase);

  useEffect(() => {
    if (paperWallet.current) {
      toPng(paperWallet.current).then(setPaperWalletImage);
    }
  }, [paperWallet.current]);

  return (
    <>
      <Container>
        {flowHeader}
        <Box sx={{ position: 'absolute', top: '-1000%', left: '-1000%' }}>
          <PaperWallet
            ref={paperWallet}
            address={address}
            type={WalletType.MNEMONIC}
            secret={mnemonicPhrase}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }} mb="4">
          <Heading fontSize="24px" lineHeight="150%">
            {translateRaw('NEW_ACCOUNT_TITLE')}
          </Heading>
        </Box>
        <Panel mb="4">
          <Body fontSize="14px" mb="2">
            {translate('RECOVERY_PHRASE_SECRET')}{' '}
            {showMnemonicPhrase ? (
              <Body fontSize="14px" onClick={handleClick}>
                {mnemonicPhrase}
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
        <Body>
          {translate('PAPER_WALLET_DESCRIPTION', {
            $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
          })}
        </Body>
      </Container>
      <PanelBottom variant="clear">
        <Link
          data-testid="download-link"
          href={paperWalletImage}
          download={`paper-wallet-${address}`}
        >
          <Button mb="3">{translateRaw('PRINT_PAPER_WALLET')}</Button>
        </Link>
        <Button variant="inverted" onClick={onNext}>
          {translateRaw('PAPER_WALLET_PRINTED')}
        </Button>
      </PanelBottom>
    </>
  );
};
