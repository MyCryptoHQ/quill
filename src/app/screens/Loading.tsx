import React from 'react';

import { Box, Container } from '@app/components';
import Spinner from '@app/components/Spinner';

export const Loading = () => (
  <Container>
    <Box variant="horizontal-center" height="100%">
      <Spinner size={4} />
    </Box>
  </Container>
);
