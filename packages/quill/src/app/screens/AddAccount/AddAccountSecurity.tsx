import { Body, Button, SubHeading } from '@mycrypto/ui';
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
        <SubHeading textAlign="center" mb="3">
          {translateRaw('ADD_ACCOUNT_SECURITY_TITLE')}
        </SubHeading>
        <IconList icon={secureIcon} px="3" mt="4">
          <ListItem mb="40px">{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_1')}</ListItem>
          <ListItem>
            {translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_2_PART_1')}{' '}
            <Body as="span" color="RED" fontWeight="bold">
              {translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_2_PART_2')}
            </Body>
          </ListItem>
        </IconList>
      </ScrollableContainer>
      <PanelBottom variant="clear">
        <Button onClick={handleClick}>{translateRaw('ACKNOWLEDGE_AND_CONTINUE')}</Button>
      </PanelBottom>
    </>
  );
};
