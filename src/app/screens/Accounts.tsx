import React from 'react';

import { useSelector } from 'react-redux';

import { getAccounts, removeAccount, useDispatch } from '@app/store';
import deleteIcon from '@assets/icons/circle-delete.svg';
import { Blockie, Body, Box, Container, Divider, Heading, Image, LinkApp } from '@components';
import { translateRaw } from '@translations';
import { IAccount } from '@types';

const Account = ({ account }: { account: IAccount }) => {
  const dispatch = useDispatch();
  const handleDelete = () => dispatch(removeAccount(account));

  return (
    <Box variant="rowAlign" py="3">
      <Blockie address={account.address} width="32px" mr="1" />
      <Box>
        <Body>{account.label ?? translateRaw('NO_LABEL')}</Body>
        <Body sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} color="GREY_TEXT">
          {account.address}
        </Body>
      </Box>
      <LinkApp href="#" onClick={handleDelete}>
        <Image
          src={deleteIcon}
          width="20px"
          height="20px"
          data-testid={`delete-${account.address}`}
        />
      </LinkApp>
    </Box>
  );
};

export const Accounts = () => {
  const accounts = useSelector(getAccounts);

  return (
    <Container>
      <Heading fontSize="24px" lineHeight="150%" mb="1">
        {translateRaw('YOUR_ACCOUNTS')}
      </Heading>
      {accounts.map((a) => (
        <React.Fragment key={a.uuid}>
          <Account account={a} />
          <Divider />
        </React.Fragment>
      ))}
    </Container>
  );
};
