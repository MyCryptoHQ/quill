import { SubHeading } from '@mycrypto/ui';
import { quitApp, reset, translateRaw } from '@quill/common';
import React from 'react';

import { useDispatch } from '@app/store';
import aboutIcon from '@assets/icons/about.svg';
import addressBookIcon from '@assets/icons/addressbook.svg';
import keyIcon from '@assets/icons/key.svg';
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
      <SubHeading mb="1">{translateRaw('SETTINGS')}</SubHeading>
      <SettingsLink
        icon={addressBookIcon}
        label={translateRaw('ACCOUNTS')}
        href={ROUTE_PATHS.ACCOUNTS}
      />
      <AutoLockSettings />
      <SettingsLink
        icon={keyIcon}
        label={translateRaw('CHANGE_PASSWORD')}
        href={ROUTE_PATHS.CHANGE_PASSWORD}
      />
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
