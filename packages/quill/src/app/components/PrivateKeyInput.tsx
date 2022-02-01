import { Box, Image } from '@mycrypto/ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import hide from '@assets/icons/eye-hide.svg';
import show from '@assets/icons/eye-show.svg';

import { FormInput } from './FormInput';

export const PrivateKeyInput = ({ ...props }: ComponentProps<typeof FormInput>) => {
  const [hidden, setHidden] = useState(true);

  const handleToggle = () => setHidden((h) => !h);

  return (
    <Box variant="horizontal-start" width="100%">
      <FormInput
        type={hidden ? 'password' : 'text'}
        {...props}
        py="1"
        width="100%"
        pr="2rem"
        sx={{ textAlign: 'right' }}
      />
      <Image src={hidden ? show : hide} ml="-2rem" sx={{ zIndex: 2 }} onClick={handleToggle} />
    </Box>
  );
};
