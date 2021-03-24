import React from 'react';

import { InputProps } from '@rebass/forms/styled-components';
import { DefaultError, DefaultState, useListener } from 'typed-react-form';
import { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

import { Body } from './Typography';

export const FormError = <
  T,
  Key extends keyof T,
  Value extends T[Key] | T[Key][keyof T[Key]],
  State extends DefaultState = DefaultState,
  Error extends string = DefaultError
>({
  form,
  name,
  ...rest
}: Omit<Omit<InputProps, 'form'> & FormInputProps<T, State, Error, Key, Value>, 'as'>) => {
  const { error } = useListener(form, name);

  return (
    <Body variant="error" {...rest}>
      {error}
    </Body>
  );
};
