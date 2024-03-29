import { Banner, Body, Button, Image, SubHeading } from '@mycrypto/ui';
import { addGeneratedAccount, getGeneratedAccount, translateRaw, WalletType } from '@quill/common';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react';

import safeWallet from '@assets/icons/safe-wallet.svg';
import type { IFlowComponentProps } from '@components';
import { Box, Link, PanelBottom, PaperWallet, ScrollableContainer } from '@components';
import { DEFAULT_DERIVATION_PATH } from '@config/derivation';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

export const GenerateAccountPrint = ({ flowHeader }: IFlowComponentProps) => {
  const paperWallet = useRef<HTMLDivElement>();
  const [paperWalletImage, setPaperWalletImage] = useState<string>();
  const { address, mnemonicPhrase } = useSelector(getGeneratedAccount);
  const dispatch = useDispatch();
  const handleNext = () => dispatch(addGeneratedAccount());

  useEffect(() => {
    if (paperWallet.current) {
      toPng(paperWallet.current).then(setPaperWalletImage);
    }
  }, [paperWallet.current]);

  return (
    <>
      <ScrollableContainer>
        {flowHeader}
        <Box sx={{ position: 'absolute', top: '-1000%', left: '-1000%' }}>
          <PaperWallet
            ref={paperWallet}
            address={address}
            type={WalletType.MNEMONIC}
            secret={mnemonicPhrase}
            derivationPath={DEFAULT_DERIVATION_PATH}
          />
        </Box>
        <Box mb="3">
          <Banner type="error" label={translateRaw('NEVER_STORE_PAPER_WALLET_DIGITALLY')}>
            {translate('NEVER_STORE_PAPER_WALLET_DIGITALLY_CONTENT')}
          </Banner>
          <Box sx={{ textAlign: 'center' }}>
            <Image src={safeWallet} alt="Safe wallet" width="57px" height="67px" />
            <SubHeading>{translateRaw('GENERATE_ACCOUNT_PRINT_HEADER')}</SubHeading>
          </Box>
        </Box>
        <Body>{translate('GENERATE_ACCOUNT_PRINT_BODY_1')}</Body>
        <Body mt="2">{translate('GENERATE_ACCOUNT_PRINT_BODY_2')}</Body>
      </ScrollableContainer>
      <PanelBottom variant="clear">
        <Link
          data-testid="download-link"
          href={paperWalletImage}
          download={`paper-wallet-${address}`}
        >
          <Button mb="3">{translateRaw('PRINT_PAPER_WALLET')}</Button>
        </Link>
        <Button variant="inverted" onClick={handleNext}>
          {translateRaw('PAPER_WALLET_PRINTED')}
        </Button>
      </PanelBottom>
    </>
  );
};
