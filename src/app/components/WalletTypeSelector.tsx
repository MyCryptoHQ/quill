import { Body, Heading } from '@mycrypto/ui';
import { goBack } from 'connected-react-router';

import { Box, Image } from '@app/components';
import back from '@assets/icons/back.svg';
import keystore from '@assets/icons/keystore.svg';
import mnemonic from '@assets/icons/mnemonic-phrase.svg';
import privatekey from '@assets/icons/private-key.svg';
import { translateRaw } from '@common/translate';
import { useDispatch } from '@store';
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
      variant="vertical-start"
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
      mb="3"
      data-testid={`select-${type}`}
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
}) => {
  const dispatch = useDispatch();

  const handleBack = () => {
    dispatch(goBack());
  };

  return (
    <>
      <Box mt="2">
        <Image
          alt="Back"
          src={back}
          width="20px"
          height="16px"
          onClick={handleBack}
          data-testid="back-button"
          sx={{
            cursor: 'pointer'
          }}
        />
      </Box>
      <Box maxWidth="75%" mx="auto" mt="-10px">
        <Heading as="h2" fontSize="24px" lineHeight="36px" textAlign="center" mb="2">
          {translateRaw('ENTER_WALLET_TO_CONTINUE', { $wallet: configs[walletType].label })}
        </Heading>
      </Box>
      <Box variant="horizontal-start">
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
    </>
  );
};
