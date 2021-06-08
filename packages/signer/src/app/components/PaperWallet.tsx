import { Blockie, Body, Flex, Image } from '@mycrypto/ui';
import { translateRaw, WalletType } from '@signer/common';
import type { TAddress } from '@signer/common';
import type { PropsWithChildren } from 'react';
import { forwardRef } from 'react';

import alertRed from '@assets/icons/alert-red.svg';
import alert from '@assets/icons/alert.svg';
import email from '@assets/icons/email.svg';
import safeWallet from '@assets/icons/safe-wallet.svg';
import logo from '@assets/images/logo-paper-wallet.svg';
import { Box, LinkApp, QR } from '@components';
import { translate } from '@translations';

interface BlockProps {
  title?: string;
}

const Block = ({ title, children }: PropsWithChildren<BlockProps>) => (
  <Flex
    variant="vertical-start"
    width="100%"
    height="100%"
    backgroundColor="border.dark"
    sx={{ border: '5px solid', borderColor: 'border.dark', borderRadius: '8px' }}
  >
    {title && (
      <Box pt="9px" pb="14px" width="100%">
        <Body color="white" lineHeight="20px" fontWeight="bold" textAlign="center">
          {title}
        </Body>
      </Box>
    )}
    <Box
      width="100%"
      backgroundColor="white"
      p="6px"
      sx={{ borderRadius: '6px', boxSizing: 'border-box', flex: '1', textAlign: 'center' }}
    >
      {children}
    </Box>
  </Flex>
);

const NotesBlock = ({ title, children }: PropsWithChildren<BlockProps>) => (
  <Flex
    variant="vertical-start"
    width="100%"
    height="100%"
    backgroundColor="BG_GREY_MUTED"
    sx={{ border: '5px solid', borderColor: 'border.dark', borderRadius: '8px' }}
  >
    {title && (
      <Box
        pt="9px"
        pb="14px"
        width="100%"
        backgroundColor="white"
        sx={{
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px'
        }}
      >
        <Body color="border.dark" lineHeight="20px" textAlign="center">
          {title}
        </Body>
      </Box>
    )}
    <Box
      width="100%"
      p="7px"
      sx={{ borderRadius: '6px', boxSizing: 'border-box', flex: '1', textAlign: 'center' }}
    >
      {children}
    </Box>
  </Flex>
);

const Line = () => <Box width="100%" height="1px" mt="21px" backgroundColor="BLUE_GREY" />;

interface GridBoxProps {
  last?: boolean;
  inverted?: boolean;
}

const GridBox = ({ last, inverted, children }: PropsWithChildren<GridBoxProps>) => (
  <Box
    p="3"
    sx={{
      boxSizing: 'content-box',
      borderTop: inverted && '2px dashed',
      borderRight: !last && !inverted && '2px dashed',
      borderLeft: !last && inverted && '2px dashed',
      borderColor: 'border.light',
      transform: inverted && 'rotate(180deg)'
    }}
  >
    {children}
  </Box>
);

interface PaperWalletProps {
  type: WalletType;
  address: TAddress;
  secret: string;
  derivationPath?: string;
}

export const PaperWallet = forwardRef(
  ({ type, address, secret, derivationPath }: PaperWalletProps, ref) => (
    <Box
      ref={ref}
      backgroundColor="white"
      width="1080px"
      height="576px"
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)'
      }}
    >
      <GridBox inverted={true}>
        <Block
          title={
            type === WalletType.MNEMONIC
              ? translateRaw('MNEMONIC_PHRASE')
              : translateRaw('PRIVATE_KEY')
          }
        >
          <Flex variant="vertical-start" justifyContent="space-between" height="100%">
            <Box>
              <Box sx={{ lineHeight: '0' }}>
                <QR size={120} data={secret} />
              </Box>
              <Body fontSize="10px" lineHeight="12px" sx={{ wordBreak: 'break-word' }}>
                {secret}
              </Body>
            </Box>
            <Flex variant="horizontal-center" width="100%">
              <Image src={alertRed} alt="Share" height="12px" mr="2" />
              <Body fontSize="10px" color="text.alert">
                {translateRaw('KEEP_THIS_SAFE')}
              </Body>
            </Flex>
          </Flex>
        </Block>
      </GridBox>
      <GridBox inverted={true}>
        <Block>
          <Flex variant="vertical-center" height="100%">
            <Box mb="2">
              <Blockie address={address} width="45px" height="45px" />
            </Box>
            <Body fontWeight="bold" fontSize="16px" lineHeight="19px" mb="2">
              {translateRaw('YOUR_IDENTICON')}
            </Body>
            <Body fontSize="12px" lineHeight="14px" maxWidth="60%" mb="3">
              {translateRaw('IDENTICON_DESCRIPTION')}
            </Body>
            {derivationPath && (
              <Box>
                <Body fontWeight="bold" fontSize="16px" lineHeight="19px">
                  {translateRaw('DERIVATION_PATH_CLEAN')}
                </Body>
                <Body>{derivationPath}</Body>
              </Box>
            )}
          </Flex>
        </Block>
      </GridBox>
      <GridBox inverted={true} last={true}>
        <NotesBlock title={translateRaw('NOTES')}>
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
          <Line />
        </NotesBlock>
      </GridBox>
      <GridBox>
        <Block title={translateRaw('PUBLIC_ADDRESS')}>
          <Flex variant="vertical-start" justifyContent="space-between" height="100%">
            <Box flex="1">
              <Box sx={{ lineHeight: '0' }}>
                <QR size={120} data={address} />
              </Box>
              <Body fontSize="10px">{address}</Body>
            </Box>
            <Flex justifyContent="space-between" width="100%">
              <Image src={email} alt="Share" />
              <Body fontSize="10px" variant="muted">
                {translateRaw('SHARE_WITH_YOUR_FRIENDS')}
              </Body>
            </Flex>
          </Flex>
        </Block>
      </GridBox>
      <GridBox>
        <Flex variant="vertical-center" justifyContent="space-between" pt="45px" height="100%">
          <Box sx={{ textAlign: 'center' }}>
            <Body fontWeight="bold" fontSize="20px" lineHeight="24px" mb="3">
              {translateRaw('KEEPING_YOUR_CRYPTO_SAFE')}
            </Body>
            <Image src={safeWallet} alt="Safe wallet" />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Body fontSize="18px" lineHeight="22px" mb="1">
              {translateRaw('RESOURCES_AND_HELP')}
            </Body>
            <Body fontSize="16px" lineHeight="19px">
              <LinkApp href="https://support.mycrypto.com" isExternal={true}>
                https://support.mycrypto.com
              </LinkApp>
            </Body>
          </Box>
        </Flex>
      </GridBox>
      <GridBox last={true}>
        <Box sx={{ textAlign: 'center' }}>
          <Image
            src={logo}
            alt="MyCrypto Paper Wallet"
            width="275px"
            mt="4"
            sx={{ margin: 'auto' }}
          />
          <Flex variant="horizontal-center" mt="4">
            <Image src={alert} alt="Alert" />
            <Body variant="muted">{translate('KEEP_PRIVATE')}</Body>
          </Flex>
        </Box>
      </GridBox>
    </Box>
  )
);
