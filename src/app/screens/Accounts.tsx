import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { getAccounts, removeAccount, useDispatch } from '@app/store';
import deleteIcon from '@assets/icons/circle-delete.svg';
import {
  Blockie,
  Body,
  Box,
  Container,
  DeleteOverlay,
  Divider,
  Heading,
  Image,
  Link
} from '@components';
import { translateRaw } from '@translations';
import { IAccount } from '@types';

const Account = ({ account }: { account: IAccount }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = () => setIsDeleting(true);
  const handleCancel = () => setIsDeleting(false);
  const handleConfirm = () => dispatch(removeAccount(account));

  return !isDeleting ? (
    <Box variant="rowAlign" py="3">
      <Blockie address={account.address} width="32px" mr="1" />
      <Box>
        <Body>{account.label ?? translateRaw('NO_LABEL')}</Body>
        <Body sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} color="GREY_TEXT">
          {account.address}
        </Body>
      </Box>
      <Link onClick={handleDelete} ml="auto">
        <Image
          src={deleteIcon}
          width="20px"
          height="20px"
          data-testid={`delete-${account.address}`}
        />
      </Link>
    </Box>
  ) : (
    <DeleteOverlay account={account} handleDelete={handleConfirm} handleCancel={handleCancel} />
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
