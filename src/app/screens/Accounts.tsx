import { Blockie, Body, Heading } from '@mycrypto/ui';
import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import { getAccounts, removeAccount, updateAccount, useDispatch } from '@app/store';
import deleteIcon from '@assets/icons/circle-delete.svg';
import { translateRaw } from '@common/translate';
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
import { IAccount } from '@types';

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
  const accounts = useSelector(getAccounts);

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
