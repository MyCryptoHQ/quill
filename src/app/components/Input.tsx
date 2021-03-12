import React from 'react';

import { InputProps, Input as RebassInput } from '@rebass/forms/styled-components';
import { DefaultError, DefaultState, FormInput } from 'typed-react-form';
import { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

export const Input = <
  T,
  Key extends keyof T,
  Value extends T[Key] | T[Key][keyof T[Key]],
  State extends DefaultState = DefaultState,
  Error extends string = DefaultError
>({
  form,
  children,
  ...rest
}: Omit<Omit<InputProps, 'form'> & FormInputProps<T, State, Error, Key, Value>, 'as'>) => (
  <RebassInput as={FormInput} form={form as any} {...rest}>
    {children}
  </RebassInput>
);
