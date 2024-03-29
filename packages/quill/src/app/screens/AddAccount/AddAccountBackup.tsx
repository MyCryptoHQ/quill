import { BlockieAddress, Body, Button, SubHeading, Tooltip } from '@mycrypto/ui';
import { getFullPath } from '@mycrypto/wallets';
import { addSavedAccounts, getAccountsToAdd, translateRaw, WalletType } from '@quill/common';
import { toPng } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'rebass/styled-components';

import type { IFlowComponentProps } from '@components';
import { Box, Checkbox, Panel, PanelBottom, PaperWallet, ScrollableContainer } from '@components';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

export const AddAccountBackup = ({ flowHeader }: IFlowComponentProps) => {
  const paperWallet = useRef<HTMLDivElement>();
  const dispatch = useDispatch();
  const { accounts, secret } = useSelector(getAccountsToAdd);
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

  const walletType = accounts[0].walletType;

  return (
    <>
      <ScrollableContainer>
        {flowHeader}
        <Box sx={{ position: 'absolute', top: '-1000%', left: '-1000%' }}>
          <PaperWallet
            ref={paperWallet}
            address={accounts[0].address}
            type={walletType}
            secret={secret}
            derivationPath={
              accounts[0].walletType === WalletType.MNEMONIC &&
              getFullPath(accounts[0].path, accounts[0].index)
            }
          />
        </Box>
        <SubHeading my="1" textAlign="center">
          {translateRaw('BACKUP_ACCOUNT', { $wallet: translateRaw(walletType) })}
        </SubHeading>
        {walletType === WalletType.MNEMONIC ? (
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
        {accounts.map((account) => (
          <Panel key={account.address} mb="2">
            <Body fontSize="2" mb="1">
              {translate('ADDRESS')}
            </Body>
            <BlockieAddress address={account.address} mb="2" />
            {account.walletType === WalletType.MNEMONIC && (
              <Body fontSize="2">
                {translate('DERIVATION_PATH')} {getFullPath(account.path, account.index)}
              </Body>
            )}
          </Panel>
        ))}
      </ScrollableContainer>
      <PanelBottom variant={accounts.length === 1 ? 'clear' : undefined}>
        <Link
          data-testid="download-link"
          href={paperWalletImage}
          download={`paper-wallet-${accounts[0].address}`}
        >
          <Button mb="2">{translateRaw('PRINT_PAPER_WALLET')}</Button>
        </Link>
        <Button mb="2" variant="inverted" onClick={handleAdd}>
          {translateRaw('CONTINUE_ADD_ACCOUNT', {
            $type: translateRaw(walletType === WalletType.MNEMONIC ? 'PHRASE' : walletType)
          })}
        </Button>
        <Box pt="2" variant="horizontal-start">
          <Checkbox checked={persistent} onChange={handleToggle} data-testid="toggle-persistence" />
          <Body pl="2">
            {translateRaw('PERSISTENCE_CHECKBOX')}
            <Tooltip tooltip={translateRaw('PERSISTENCE_CHECKBOX_TOOLTIP')} ml="1" />
          </Body>
        </Box>
      </PanelBottom>
    </>
  );
};
