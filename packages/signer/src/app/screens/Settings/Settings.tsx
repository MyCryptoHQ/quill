import { Heading } from '@mycrypto/ui';
import { setNavigationBack } from '@signer/common';
import React, { useEffect } from 'react';

import { useDispatch } from '@app/store';
import aboutIcon from '@assets/icons/about.svg';
import deleteIcon from '@assets/icons/circle-delete.svg';
import { Container } from '@components';
import { ROUTE_PATHS } from '@routing';

import { AutoLockSettings } from './AutoLockSettings';
import { SettingsLink } from './SettingsLink';

export const Settings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setNavigationBack(ROUTE_PATHS.HOME));

    return () => dispatch(setNavigationBack(undefined));
  }, []);

  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        Settings
      </Heading>
      <SettingsLink icon={deleteIcon} label="Accounts" href={ROUTE_PATHS.ACCOUNTS} />
      <AutoLockSettings />
      <SettingsLink icon={deleteIcon} label="Quit App" href={ROUTE_PATHS.ACCOUNTS} />
      <SettingsLink icon={aboutIcon} label="About" href={ROUTE_PATHS.ACCOUNTS} />
    </Container>
  );
};
