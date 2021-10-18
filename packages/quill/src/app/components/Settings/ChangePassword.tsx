import { Body, Button } from '@mycrypto/ui';
import { changePassword, getLoggingIn, translateRaw } from '@quill/common';
import type { FunctionComponent } from 'react';

import lockIcon from '@assets/icons/lock.svg';
import { PasswordForm, SettingsAccordion } from '@components';
import { useDispatch, useSelector } from '@store';

export const ChangePassword: FunctionComponent = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(getLoggingIn);

  const handleSubmit = (password: string) => {
    dispatch(changePassword(password));
  };

  return (
    <SettingsAccordion icon={lockIcon} label={translateRaw('CHANGE_PASSWORD')}>
      <Body>{translateRaw('CHANGE_PASSWORD_BODY')}</Body>
      <PasswordForm onSubmit={handleSubmit} />
      <Button type="submit" form="create-password-form" loading={loggingIn} mt="3">
        {translateRaw('CHANGE_PASSWORD_BUTTON')}
      </Button>
    </SettingsAccordion>
  );
};
