import type { Input } from '@mycrypto/ui';
import { Box, Image } from '@mycrypto/ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import type { DefaultError, DefaultState, FormInputProps } from 'typed-react-form';

import hide from '@assets/icons/eye-hide.svg';
import show from '@assets/icons/eye-show.svg';

import { FormInput } from './FormInput';
import { FormTextArea } from './FormTextArea';

export const MnemonicInput = <
  T,
  Key extends keyof T,
  Value extends T[Key] | T[Key][keyof T[Key]],
  State extends DefaultState = DefaultState,
  Error extends string = DefaultError
>({
  ...props
}: Omit<ComponentProps<typeof Input>, 'form'> & FormInputProps<T, State, Error, Key, Value>) => {
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
        // @ts-expect-error Props don't match up 100%
        <FormTextArea {...props} py="1" width="100%" pr={'2rem'} sx={{ textAlign: 'right' }} />
      )}
      <Image src={hidden ? show : hide} ml="-2rem" sx={{ zIndex: 2 }} onClick={handleToggle} />
    </Box>
  );
};
