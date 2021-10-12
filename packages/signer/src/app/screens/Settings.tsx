import { Heading } from '@mycrypto/ui';
import { quitApp, reset, setNavigationBack, translateRaw } from '@signer/common';
import React, { useEffect } from 'react';

import { useDispatch } from '@app/store';
import addressBookIcon from '@assets/icons/addressbook.svg';
import quitIcon from '@assets/icons/quit.svg';
import resetIcon from '@assets/icons/reset.svg';
import { AutoLockSettings, Container, SettingsConfirm, SettingsLink } from '@components';
import { ROUTE_PATHS } from '@routing';

export const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavigationBack(ROUTE_PATHS.HOME));

    return () => dispatch(setNavigationBack(undefined));
  }, []);

  const handleQuit = () => dispatch(quitApp());
  const handleReset = () => dispatch(reset());
  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        {translateRaw('Settings')}
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
    </Container>
  );
};
