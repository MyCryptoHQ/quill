import { Button } from '@mycrypto/ui';
import { push } from 'connected-react-router';
import { useEffect, useRef, useState } from 'react';

import secureIcon from '@assets/icons/secure-purple.svg';
import { setAccountsToAdd } from '@common/store';
import { translateRaw } from '@common/translate';
import { IconList, ListItem, PanelBottom, ScrollableContainer } from '@components';
import { BackHeading } from '@components/BackHeading';
import { useUnmount } from '@hooks';
import { ROUTE_PATHS } from '@routing';
import { useDispatch } from '@store';

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
    dispatch(setAccountsToAdd([]));
  });

  return (
    <>
      <ScrollableContainer ref={ref}>
        <BackHeading>Addressing Security for The MyCrypto Signer</BackHeading>
        <IconList icon={secureIcon} px="3">
          <ListItem>
            Storing an account within this application will <strong>ONLY</strong> store the private
            key for that respective account.
          </ListItem>
          <ListItem>
            This application does <strong>NOT</strong> store any mnemonic phrases.
          </ListItem>
          <ListItem>
            If you lose your private key or mnemonic phrase for any account, there is no recovery
            option.
          </ListItem>
          <ListItem>
            If you lose the password to this application, you will need to re-import your account(s)
            via backups that you've saved elsewhere.
          </ListItem>
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
