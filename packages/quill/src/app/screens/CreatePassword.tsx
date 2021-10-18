import { Body, Button, SubHeading } from '@mycrypto/ui';
import { createPassword, getLoggingIn, translateRaw } from '@quill/common';

import { PanelBottom, PasswordForm, ScrollableContainer } from '@components';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

export const CreatePassword = () => {
  const dispatch = useDispatch();
  const loggingIn = useSelector(getLoggingIn);

  const handleSubmit = (password: string) => {
    dispatch(createPassword(password));
  };

  return (
    <>
      <ScrollableContainer pt="4">
        <SubHeading mb="2" textAlign="center">
          {translateRaw('CREATE_A_PASSWORD')}
        </SubHeading>
        <Body>{translate('CREATE_PASSWORD_DESCRIPTION_1')}</Body>
        <PasswordForm onSubmit={handleSubmit} />
      </ScrollableContainer>
      <PanelBottom variant="clear">
        <Button type="submit" form="create-password-form" loading={loggingIn}>
          {translateRaw('CREATE_PASSWORD')}
        </Button>
      </PanelBottom>
    </>
  );
};
