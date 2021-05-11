import { BlockieAddress, Body, Button, Heading } from '@mycrypto/ui';
import { getFullPath } from '@mycrypto/wallets';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'rebass/styled-components';

import { addSavedAccounts, getAccountsToAdd } from '@common/store';
import { translateRaw } from '@common/translate';
import type { IFlowComponentProps } from '@components';
import { Box, Checkbox, Container, Panel, PanelBottom, PaperWallet } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';
import { WalletType } from '@types';

export const AddAccountBackup = ({ flowHeader }: IFlowComponentProps) => {
  const paperWallet = useRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const { type, accounts, secret } = useSelector(getAccountsToAdd);
  const [persistent, setPersistent] = useState(true);
  const [paperWalletImage, setPaperWalletImage] = useState<string>();

  const handleToggle = () => setPersistent((value) => !value);

  const handleAdd = () => {
    dispatch(addSavedAccounts(persistent));
  };

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
            address={accounts[0].address}
            type={type}
            secret={secret}
          />
        </Box>
        <Heading as="h2" fontSize="24px" lineHeight="36px" my="1" textAlign="center">
          {translateRaw('BACKUP_ACCOUNT', { $wallet: translateRaw(accounts[0].walletType) })}
        </Heading>
        {type === WalletType.MNEMONIC ? (
          <Body mb="2">
            {translate('BACKUP_MNEMONIC_PHRASE', {
              $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
            })}
          </Body>
        ) : (
          <>
            <Body mb="2">
              {translate('BACKUP_PRIVATE_KEY', {
                $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
              })}
            </Body>
            <Body mb="2" variant="muted" fontSize="1">
              {translate('BACKUP_PRIVATE_KEY_NOTE', {
                $link: getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_BACKUP)
              })}
            </Body>
          </>
        )}
        <Panel mb="2">
          <Body fontSize="14px" mb="1">
            {translate('ADDRESS')}
          </Body>
          <BlockieAddress address={accounts[0].address} mb="2" />
          {accounts[0].walletType === WalletType.MNEMONIC && (
            <Body fontSize="14px">
              {translate('DERIVATION_PATH')} {getFullPath(accounts[0].path, accounts[0].index)}
            </Body>
          )}
        </Panel>
      </Container>
      <PanelBottom variant="clear">
        <Link
          data-testid="download-link"
          href={paperWalletImage}
          download={`paper-wallet-${accounts[0].address}`}
        >
          <Button mb="2">{translateRaw('PRINT_PAPER_WALLET')}</Button>
        </Link>
        <Button mb="2" variant="inverted" onClick={handleAdd}>
          {translateRaw('CONTINUE_ADD_ACCOUNT')}
        </Button>
        <Box pt="2" variant="horizontal-start">
          <Checkbox checked={persistent} onChange={handleToggle} data-testid="toggle-persistence" />
          <Body pl="2">{translateRaw('PERSISTENCE_CHECKBOX')}</Body>
        </Box>
      </PanelBottom>
    </>
  );
};
