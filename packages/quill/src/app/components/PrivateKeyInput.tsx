import type { Input } from '@mycrypto/ui';
import { Box, Image } from '@mycrypto/ui';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import type { DefaultError, DefaultState, FormInputProps } from 'typed-react-form';

import hide from '@assets/icons/eye-hide.svg';
import show from '@assets/icons/eye-show.svg';

import { FormInput } from './FormInput';

export const PrivateKeyInput = <
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
      <FormInput type={hidden ? 'password' : 'text'} {...props} width="100%" pr="2rem" />
      <Image src={hidden ? show : hide} ml="-2rem" sx={{ zIndex: 2 }} onClick={handleToggle} />
    </Box>
  );
};
