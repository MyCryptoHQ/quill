import React, { useState } from 'react';

import { ROUTE_PATHS } from '@routing';

import { Address, Body, Box, Button, Heading, Link, LinkApp, Panel } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config/helpArticles';
import { DEFAULT_DERIVATION_PATH, getGeneratedAccount, useSelector } from '@store';
import { translate, translateRaw } from '@translations';

export const GenerateAccountEnd = () => {
  const [showMnemonicPhrase, setShowMnemonicPhrase] = useState(false);
  const { address, mnemonicPhrase } = useSelector(getGeneratedAccount);

  const handleClick = () => setShowMnemonicPhrase(true);

  return (
    <Box>
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
      <Button mb="3">{translateRaw('PRINT_PAPER_WALLET')}</Button>
      <LinkApp href={ROUTE_PATHS.HOME}>
        <Button variant="inverted" mb="3">
          {translateRaw('PAPER_WALLET_PRINTED')}
        </Button>
      </LinkApp>
    </Box>
  );
};
