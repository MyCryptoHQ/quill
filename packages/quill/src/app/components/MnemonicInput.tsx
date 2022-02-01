import { Box, Image } from '@mycrypto/ui';
import { useState } from 'react';

import hide from '@assets/icons/eye-hide.svg';
import show from '@assets/icons/eye-show.svg';

import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';

export const MnemonicInput = ({ ...props }) => {
  const [hidden, setHidden] = useState(true);

  const handleToggle = () => setHidden((h) => !h);

  return (
    <Box variant="horizontal-start" width="100%">
      {hidden ? (
        <FormInput
          {...props}
          type="password"
          py="1"
          width="100%"
          pr={'2rem'}
          sx={{ textAlign: 'right' }}
        />
      ) : (
        <FormTextArea {...props} py="1" width="100%" pr={'2rem'} sx={{ textAlign: 'right' }} />
      )}
      <Image src={hidden ? show : hide} ml="-2rem" sx={{ zIndex: 2 }} onClick={handleToggle} />
    </Box>
  );
};
