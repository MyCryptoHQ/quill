import { Body, Button } from '@mycrypto/ui';
import { replace } from 'connected-react-router';
import { useSelector } from 'react-redux';

import { Box, Container, PanelBottom } from '@app/components';
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
        <Box variant="horizontal-center" height="100%">
          <Box variant="vertical-start" sx={{ textAlign: 'center' }}>
            <Body>{request.origin}</Body>
            {/* @todo more ui */}
          </Box>
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
