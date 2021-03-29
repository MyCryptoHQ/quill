import React, { useEffect, useRef, useState } from 'react';

import { toPng } from 'html-to-image';

import {
  Address,
  Body,
  Box,
  Button,
  Heading,
  IFlowComponentProps,
  Link,
  Panel,
  PaperWallet
} from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { DEFAULT_DERIVATION_PATH, getGeneratedAccount, useSelector } from '@store';
import { translate, translateRaw } from '@translations';

export const GenerateAccountEnd = ({ onNext }: IFlowComponentProps) => {
  const paperWallet = useRef<HTMLDivElement>();
  const [showMnemonicPhrase, setShowMnemonicPhrase] = useState(false);
  const [paperWalletImage, setPaperWalletImage] = useState<string>();
  const { address, mnemonicPhrase } = useSelector(getGeneratedAccount);

  const handleClick = () => setShowMnemonicPhrase(true);

  useEffect(() => {
    if (paperWallet.current) {
      toPng(paperWallet.current).then(setPaperWalletImage);
    }
  }, [paperWallet]);

  return (
    <Box>
      <Box sx={{ position: 'absolute', top: '-1000%', left: '-1000%' }}>
        <PaperWallet ref={paperWallet} address={address} mnemonicPhrase={mnemonicPhrase} />
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
            mnemonicPhrase
          ) : (
            <Link variant="defaultLink" onClick={handleClick}>
              {translate('CLICK_TO_SHOW')}
            </Link>
          )}
        </Body>
        <Body fontSize="14px" mb="1">
          {translate('ADDRESS')}
        </Body>
        <Address address={address} mb="2" />
        <Body fontSize="14px">
          {translate('DERIVATION_PATH')} {DEFAULT_DERIVATION_PATH}
        </Body>
      </Panel>
      <Body mb="4">
        {translate('PAPER_WALLET_DESCRIPTION', {
          $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
        })}
      </Body>
      <Link
        data-testid="download-link"
        href={paperWalletImage}
        download={`paper-wallet-${address}`}
      >
        <Button mb="3">{translateRaw('PRINT_PAPER_WALLET')}</Button>
      </Link>
      <Button variant="inverted" mb="3" onClick={onNext}>
        {translateRaw('PAPER_WALLET_PRINTED')}
      </Button>
    </Box>
  );
};
