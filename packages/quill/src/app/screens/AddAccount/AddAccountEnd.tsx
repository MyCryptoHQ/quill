import { Body, Button, SubHeading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import type { IFlowComponentProps } from '@app/components';
import { Box, Container, LinkApp, Logo, PanelBottom } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';

export const AddAccountEnd = ({ onReset }: IFlowComponentProps) => (
  <>
    <Container>
      <Box>
        <Logo width="64px" height="64px" mx="auto" />
        <SubHeading mt="3" mb="3" textAlign="center">
          {translateRaw('ADD_ACCOUNT_END_HEADER')}
        </SubHeading>
        <Body mb="3">{translateRaw('ADD_ACCOUNT_END_BODY_1')}</Body>
        <Body>{translateRaw('ADD_ACCOUNT_END_BODY_2')}</Body>
      </Box>
    </Container>
    <PanelBottom variant="clear">
      <LinkApp href="https://app.mycrypto.com/add-account" width="100%" isExternal={true}>
        <Button>{translateRaw('CONNECT_QUILL_TO_MYCRYPTO')}</Button>
      </LinkApp>
      <Button variant="inverted" mt="3" onClick={onReset}>
        {translateRaw('ADD_ANOTHER_ACCOUNT')}
      </Button>
      <Box mt="3" sx={{ textAlign: 'center' }}>
        <LinkApp href={ROUTE_PATHS.HOME}>{translateRaw('BACK_TO_HOME')}</LinkApp>
      </Box>
    </PanelBottom>
  </>
);
