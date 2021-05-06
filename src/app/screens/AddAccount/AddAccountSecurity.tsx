import { Button } from '@mycrypto/ui';
import { push } from 'connected-react-router';
import { useEffect, useRef, useState } from 'react';

import secureIcon from '@assets/icons/secure-purple.svg';
import { translateRaw } from '@common/translate';
import { IconList, ListItem, PanelBottom, ScrollableContainer } from '@components';
import { BackHeading } from '@components/BackHeading';
import { useUnmount } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { useDispatch } from '@store';
import { translate } from '@translations';

export const AddAccountSecurity = () => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>();
  const [isClickable, setClickable] = useState(false);

  const handleScroll = () => {
    if (ref.current.scrollHeight <= ref.current.clientHeight) {
      return setClickable(true);
    }

    setClickable(ref.current.scrollTop === ref.current.scrollHeight - ref.current.offsetHeight);
  };

  const handleClick = () => {
    dispatch(push(ROUTE_PATHS.ADD_ACCOUNT_BACKUP));
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        ref.current?.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [ref.current]);

  useUnmount(() => {
    // @todo: Find a better solution for this
    // dispatch(setAccountsToAdd([]));
  });

  return (
    <>
      <ScrollableContainer ref={ref}>
        <BackHeading>{translateRaw('ADD_ACCOUNT_SECURITY_TITLE')}</BackHeading>
        <IconList icon={secureIcon} px="3">
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_1')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_2')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_3')}</ListItem>
          <ListItem>{translate('ADD_ACCOUNT_SECURITY_DESCRIPTION_4')}</ListItem>
        </IconList>
      </ScrollableContainer>
      <PanelBottom>
        <Button onClick={handleClick} disabled={!isClickable}>
          {translateRaw('ACKNOWLEDGE_AND_CONTINUE')}
        </Button>
      </PanelBottom>
    </>
  );
};
