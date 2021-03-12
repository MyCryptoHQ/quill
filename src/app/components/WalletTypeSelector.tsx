import React from 'react';

import { Body, Box, Image } from '@app/components';
import keystore from '@assets/icons/keystore.svg';
import mnemonic from '@assets/icons/mnemonic-phrase.svg';
import privatekey from '@assets/icons/private-key.svg';
import { translateRaw } from '@translations';
import { WalletType } from '@types';

const configs = {
  [WalletType.MNEMONIC]: { icon: mnemonic, label: translateRaw('MNEMONIC_PHRASE') },
  [WalletType.PRIVATE_KEY]: { icon: privatekey, label: translateRaw('PRIVATE_KEY') },
  [WalletType.KEYSTORE]: { icon: keystore, label: translateRaw('KEYSTORE') }
};

const WalletTypeButton = ({
  selected,
  type,
  label,
  icon,
  setWalletType
}: {
  selected: boolean;
  type: WalletType;
  label: string;
  icon: string;
  setWalletType(t: WalletType): void;
}) => {
  const handleSelect = () => setWalletType(type);

  return (
    <Box
      variant="columnAlign"
      bg="BG_GREY_MUTED"
      onClick={handleSelect}
      sx={{
        borderRadius: '3px',
        boxShadow:
          '0px 0.61746px 1.85238px rgba(0, 0, 0, 0.1), 0px 0.61746px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px rgba(0, 0, 0, 0.03);',
        border: selected ? '1px solid #007A99' : 'none',
        flexBasis: '0',
        flexGrow: '1'
      }}
      px="2"
      py="2"
      mx="1"
    >
      <Image src={icon} height="30px" width="30px" />
      <Body color="BLUE_DARK_SLATE" fontSize="1">
        {label}
      </Body>
    </Box>
  );
};

export const WalletTypeSelector = ({
  walletType,
  setWalletType
}: {
  walletType: WalletType;
  setWalletType(t: WalletType): void;
}) => (
  <Box variant="rowAlign">
    {Object.entries(configs).map(([type, config]) => (
      <WalletTypeButton
        key={type}
        type={type as WalletType}
        selected={type === walletType}
        label={config.label}
        icon={config.icon}
        setWalletType={setWalletType}
      />
    ))}
  </Box>
);
