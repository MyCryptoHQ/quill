import { Blockie, Body, Button, Heading } from '@mycrypto/ui';
import {
  getAccounts,
  removeAccount,
  setNavigationBack,
  translateRaw,
  updateAccount
} from '@signer/common';
import type { IAccount } from '@signer/common';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '@app/store';
import deleteIcon from '@assets/icons/circle-delete.svg';
import wallet from '@assets/icons/sad-wallet.svg';
import {
  Box,
  Container,
  DeleteOverlay,
  Divider,
  EditableText,
  Flex,
  Image,
  Link,
  LinkApp,
  PanelBottom
} from '@components';
import { ROUTE_PATHS } from '@routing';

const Account = ({ account }: { account: IAccount }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = () => setIsDeleting(true);
  const handleCancel = () => setIsDeleting(false);
  const handleConfirm = () => dispatch(removeAccount(account));
  const handleChangeLabel = (label: string) => dispatch(updateAccount({ ...account, label }));

  return !isDeleting ? (
    <Box variant="horizontal-start" py="24px">
      <Blockie address={account.address} width="32px" mr="6px" />
      <Box>
        <EditableText
          value={account.label}
          placeholder={translateRaw('NO_LABEL')}
          onChange={handleChangeLabel}
        />
        <Body
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
          color="GREY_TEXT"
          fontSize="14px"
        >
          {account.address}
        </Body>
      </Box>
      <Link variant="defaultLink" onClick={handleDelete} ml="auto">
        <Flex variant="horizontal-center">
          <Image
            src={deleteIcon}
            width="20px"
            height="20px"
            data-testid={`delete-${account.address}`}
          />
        </Flex>
      </Link>
    </Box>
  ) : (
    <DeleteOverlay
      account={account}
      handleDelete={handleConfirm}
      handleCancel={handleCancel}
      maxHeight="97px"
      marginLeft="-24px"
      marginRight="-24px"
    />
  );
};

export const Accounts = () => {
  const dispatch = useDispatch();
  const accounts = useSelector(getAccounts);

  useEffect(() => {
    dispatch(setNavigationBack(ROUTE_PATHS.HOME));

    return () => dispatch(setNavigationBack(undefined));
  }, []);

  if (accounts.length === 0) {
    return (
      <>
        <Container pt="4">
          <Box sx={{ textAlign: 'center' }}>
            <Image alt="Wallet" src={wallet} />
          </Box>
          <Box maxWidth="80%" mx="auto" sx={{ textAlign: 'center' }}>
            <Heading fontSize="24px" lineHeight="150%" mt="3" mb="2">
              {translateRaw('ACCOUNTS_EMPTY_HEADER')}
            </Heading>
            <Body variant="muted">{translateRaw('ACCOUNTS_EMPTY_BODY')}</Body>
          </Box>
        </Container>
        <PanelBottom variant="clear">
          <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT}>
            <Button>{translateRaw('MENU_ADD_ACCOUNT')}</Button>
          </LinkApp>
        </PanelBottom>
      </>
    );
  }

  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        {translateRaw('YOUR_ACCOUNTS')}
      </Heading>
      {accounts.map((a) => (
        <Fragment key={a.uuid}>
          <Account account={a} />
          <Divider />
        </Fragment>
      ))}
    </Container>
  );
};
