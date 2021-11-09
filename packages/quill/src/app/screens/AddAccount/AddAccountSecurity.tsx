import { Button, Heading } from '@mycrypto/ui';
import { nextFlow, translateRaw } from '@quill/common';

import secureIcon from '@assets/icons/secure-purple.svg';
import type { IFlowComponentProps } from '@components';
import { IconList, ListItem, PanelBottom, ScrollableContainer } from '@components';
import { useDispatch } from '@store';
import { translate } from '@translations';

export const AddAccountSecurity = ({ flowHeader }: IFlowComponentProps) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(nextFlow());
  };

  return (
    <>
      <ScrollableContainer>
        {flowHeader}
        <Heading as="h2" fontSize="24px" lineHeight="36px" textAlign="center" mb="2">
          {translateRaw('ADD_ACCOUNT_SECURITY_TITLE')}
        </Heading>
        <IconList icon={secureIcon} px="3">
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_1')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_2')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_3')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_4')}</ListItem>
        </IconList>
      </ScrollableContainer>
      <PanelBottom>
        <Button onClick={handleClick}>{translateRaw('ACKNOWLEDGE_AND_CONTINUE')}</Button>
      </PanelBottom>
    </>
  );
};
