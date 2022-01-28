import { Blockie, Body, Copyable, SubHeading } from '@mycrypto/ui';
import type { IAccount } from '@quill/common';
import { getAccounts, removeAccount, translateRaw, updateAccount } from '@quill/common';
import { push } from 'connected-react-router';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useDispatch } from '@app/store';
import deleteIcon from '@assets/icons/circle-delete.svg';
import {
  Box,
  Container,
  DeleteOverlay,
  Divider,
  EditableText,
  Flex,
  Image,
  Link
} from '@components';
import { useNavigation } from '@hooks';
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
      <Blockie address={account.address} minWidth="32px" width="32px" mr="6px" />
      <Box>
        <EditableText
          value={account.label}
          placeholder={translateRaw('NO_LABEL')}
          onChange={handleChangeLabel}
        />
        <Copyable text={account.address} mr="2">
          <Body
            sx={{ overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }}
            color="GREY_TEXT"
            fontSize="2"
            title={translateRaw('CLICK_TO_COPY')}
          >
            {account.address}
          </Body>
        </Copyable>
      </Box>
      <Link variant="defaultLink" onClick={handleDelete} ml="auto">
        <Flex variant="horizontal-center">
          <Image
            src={deleteIcon}
            minWidth="20px"
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

  useNavigation(ROUTE_PATHS.SETTINGS);

  useEffect(() => {
    if (accounts.length === 0) {
      dispatch(push(ROUTE_PATHS.SETUP_ACCOUNT));
    }
  }, [accounts.length]);

  return (
    <Container>
      <SubHeading mb="1">{translateRaw('YOUR_ACCOUNTS')}</SubHeading>
      {accounts.map((a) => (
        <Fragment key={a.uuid}>
          <Account account={a} />
          <Divider />
        </Fragment>
      ))}
    </Container>
  );
};
