import React, { forwardRef, ReactElement } from 'react';

import logo from '@assets/images/logo.svg';
import { Blockie, Body, Box, Code, Flex, Image, QR } from '@components';
import { translateRaw } from '@translations';
import { TAddress } from '@types';
import { stripHexPrefix } from '@utils';

interface BlockProps {
  title: string;
  children: ReactElement;
}

const Block = ({ title, children }: BlockProps) => (
  <Box sx={{ position: 'relative', height: '150px', boxSizing: 'content-box' }} p="20px">
    {children}
    <Body
      color="BLUE_LIGHT"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '100%',
        width: '100%',
        letterSpacing: '1px',
        textAlign: 'center',
        fontWeight: '600',
        transform: 'translate(-50%, -50%) rotate(-90deg)',
        textTransform: 'uppercase',
        fontSize: '13px'
      }}
    >
      {title}
    </Body>
  </Box>
);

interface PaperWalletProps {
  address: TAddress;
  privateKey: string;
}

export const PaperWallet = forwardRef(({ address, privateKey }: PaperWalletProps, ref) => (
  <Flex
    ref={ref}
    width="680px"
    height="370px"
    backgroundColor="white"
    sx={{
      border: '1px solid',
      borderColor: 'BODY',
      userSelect: 'none'
    }}
  >
    <Flex variant="columnCenter" width="100px" minWidth="100px" bg="BLUE_DARK_SLATE">
      <Box flex="0 0 0 100px" sx={{ textAlign: 'center', transform: 'rotate(-90deg)' }}>
        <Image src={logo} width="auto" maxWidth="unset" height="50px" />
        <Body color="white">www.MyCrypto.com</Body>
      </Box>
    </Flex>
    <Box>
      <Flex>
        <Block title={translateRaw('YOUR_ADDRESS')}>
          <QR size={150} data={address} />
        </Block>
        <Block title={translateRaw('NOTES')}>
          <Box width="135px" height="150px" backgroundColor="GREY_ATHENS" />
        </Block>
        <Block title={translateRaw('MNEMONIC_PHRASE')}>
          <QR size={150} data={privateKey} />
        </Block>
      </Flex>
      <Box px="20px">
        <Flex variant="rowAlign" justifyContent="space-between">
          <Box>
            <Code fontSize="14px">
              <strong>{translateRaw('YOUR_ADDRESS')}:</strong>
            </Code>
            <Code fontSize="14px">{address}</Code>
          </Box>
          <Blockie address={address} width="42px" minWidth="42px" height="42px" />
          <Body
            fontSize="9px"
            width="130px"
            sx={{
              fontWeight: '300',
              lineHeight: '150%',
              textAlign: 'center'
            }}
          >
            {translateRaw('BLOCKIE_NOTICE')}
          </Body>
        </Flex>
        <Code fontSize="14px">
          <strong>{translateRaw('YOUR_MNEMONIC_PHRASE')}:</strong>
        </Code>
        <Code fontSize="14px">{stripHexPrefix(privateKey)}</Code>
      </Box>
    </Box>
  </Flex>
));
