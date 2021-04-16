import { Body, Button } from '@mycrypto/ui';

import { translateRaw } from '@common/translate';
import type { IAccount } from '@types';
import { truncate } from '@utils';

import type { BoxProps } from '.';
import { Box } from '.';

export const DeleteOverlay = ({
  account,
  handleDelete,
  handleCancel,
  ...props
}: {
  account: IAccount;
  handleDelete(): void;
  handleCancel(): void;
} & BoxProps) => (
  <Box bg="BLUE_GREY" variant="horizontal-start" p="3" {...props}>
    <Body color="white" maxWidth="70%">
      {translateRaw('CONFIRM_ACCOUNT_DELETION', {
        $label: account.label ?? translateRaw('NO_LABEL'),
        $address: truncate(account.address)
      })}
    </Body>
    <Box variant="vertical-start" ml="auto">
      <Button onClick={handleDelete} py="1">
        {translateRaw('DELETE')}
      </Button>
      <Button onClick={handleCancel} py="2px" mt="2" bg="BLUE_GREY" variant="inverted">
        {translateRaw('CANCEL')}
      </Button>
    </Box>
  </Box>
);
