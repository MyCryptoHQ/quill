import { Heading } from '@mycrypto/ui';
import { quitApp, reset, translateRaw } from '@signer/common';
import React from 'react';

import { useDispatch } from '@app/store';
import aboutIcon from '@assets/icons/about.svg';
import addressBookIcon from '@assets/icons/addressbook.svg';
import quitIcon from '@assets/icons/quit.svg';
import resetIcon from '@assets/icons/reset.svg';
import { AutoLockSettings, Container, SettingsConfirm, SettingsLink } from '@components';
import { useNavigation } from '@hooks';
import { ROUTE_PATHS } from '@routing';

export const Settings = () => {
  const dispatch = useDispatch();

  useNavigation(ROUTE_PATHS.HOME);

  const handleQuit = () => dispatch(quitApp());
  const handleReset = () => dispatch(reset());
  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        {translateRaw('SETTINGS')}
      </Heading>
      <SettingsLink
        icon={addressBookIcon}
        label={translateRaw('ACCOUNTS')}
        href={ROUTE_PATHS.ACCOUNTS}
      />
      <AutoLockSettings />
      <SettingsConfirm
        icon={resetIcon}
        label={translateRaw('APP_RESET')}
        heading={translateRaw('APP_RESET_HEADING')}
        body={translateRaw('APP_RESET_BODY')}
        buttonText={translateRaw('RESET_APP_BUTTON')}
        cancelText={translateRaw('CANCEL')}
        onConfirm={handleReset}
      />
      <SettingsConfirm
        icon={quitIcon}
        label={translateRaw('QUIT_APP')}
        heading={translateRaw('CONFIRM_QUIT')}
        body={translateRaw('CONFIRM_QUIT_BODY')}
        buttonText={translateRaw('QUIT_NOW')}
        cancelText={translateRaw('CANCEL')}
        onConfirm={handleQuit}
      />
      <SettingsLink icon={aboutIcon} label={translateRaw('ABOUT')} href={ROUTE_PATHS.ABOUT} />
    </Container>
  );
};
