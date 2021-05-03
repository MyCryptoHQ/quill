import { Body, Button } from '@mycrypto/ui';
import { replace } from 'connected-react-router';
import { useSelector } from 'react-redux';

import { Box, Checkbox, Container, Logo, PanelBottom } from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { denyPermission, getPermissionRequest, grantPermission } from '@common/store';
import { translateRaw } from '@common/translate';
import { useDispatch } from '@store';

export const RequestPermission = () => {
  const dispatch = useDispatch();
  const request = useSelector(getPermissionRequest);

  const handleAllow = () => {
    dispatch(grantPermission(request));
    dispatch(replace(ROUTE_PATHS.HOME));
  };

  const handleDeny = () => {
    dispatch(denyPermission(request));
    dispatch(replace(ROUTE_PATHS.HOME));
  };

  return (
    <>
      <Container>
        <Box variant="vertical-start" sx={{ textAlign: 'center' }} mt="2">
          <Logo height="50px" width="50px" />
          <Body mt="2">{request.origin}</Body>
          <Body fontWeight="bold" mt="4">
            {translateRaw('ALLOW_THIS_SITE')}
          </Body>
          <Box variant="horizontal-start" mt="2">
            <Checkbox checked={true} mr="1" />
            <Body>{translateRaw('PERMISSION_LIST_1')}</Body>
          </Box>
          {/* @todo more ui */}
        </Box>
      </Container>
      <PanelBottom variant="clear">
        <Button onClick={handleAllow}>{translateRaw('ALLOW_PERMISSIONS')}</Button>
        <Button mt="3" variant="inverted" onClick={handleDeny}>
          {translateRaw('DENY_PERMISSIONS')}
        </Button>
      </PanelBottom>
    </>
  );
};
