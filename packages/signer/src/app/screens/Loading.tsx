import { Spinner } from '@mycrypto/ui';

import { Box, Container } from '@app/components';

export const Loading = () => (
  <Container>
    <Box variant="horizontal-center" height="100%">
      <Spinner id="loading-spinner" size={4} />
    </Box>
  </Container>
);
