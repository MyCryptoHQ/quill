import { Heading } from '@mycrypto/ui';
import { setNavigationBack, translateRaw } from '@signer/common';
import React, { useEffect } from 'react';

import { useDispatch } from '@app/store';
import aboutIcon from '@assets/icons/about.svg';
import addressBookIcon from '@assets/icons/addressbook.svg';
import { Container } from '@components';
import { ROUTE_PATHS } from '@routing';

import { AutoLockSettings } from './AutoLockSettings';
import { SettingsLink } from './SettingsLink';
import { SettingsQuit } from './SettingsQuit';

export const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavigationBack(ROUTE_PATHS.HOME));

    return () => dispatch(setNavigationBack(undefined));
  }, []);

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
      <SettingsQuit />
      <SettingsLink icon={aboutIcon} label="About" href={ROUTE_PATHS.ACCOUNTS} />
    </Container>
  );
};
