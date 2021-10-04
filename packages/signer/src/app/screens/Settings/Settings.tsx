import { Heading } from '@mycrypto/ui';
import { quitApp, setNavigationBack, translateRaw } from '@signer/common';
import React, { useEffect } from 'react';

import { useDispatch } from '@app/store';
import addressBookIcon from '@assets/icons/addressbook.svg';
import deleteIcon from '@assets/icons/circle-delete.svg';
import { Container } from '@components';
import { ROUTE_PATHS } from '@routing';

import { AutoLockSettings } from './AutoLockSettings';
import { SettingsConfirm } from './SettingsConfirm';
import { SettingsLink } from './SettingsLink';

export const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavigationBack(ROUTE_PATHS.HOME));

    return () => dispatch(setNavigationBack(undefined));
  }, []);

  const handleQuit = () => dispatch(quitApp());
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
        icon={deleteIcon}
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
