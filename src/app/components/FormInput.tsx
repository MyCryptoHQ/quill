import React from 'react';

import { InputProps, Input as RebassInput } from '@rebass/forms/styled-components';
import {
  DefaultError,
  DefaultState,
  FormInput as ReactFormInput,
  useListener
} from 'typed-react-form';
import { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

export const FormInput = <
  T,
  Key extends keyof T,
  Value extends T[Key] | T[Key][keyof T[Key]],
  State extends DefaultState = DefaultState,
  Error extends string = DefaultError
>({
  form,
  children,
  name,
  ...rest
}: Omit<
  Omit<InputProps, 'form'> & FormInputProps<T, State, Error, Key, Value>,
  'as' | 'variant'
>) => {
  const { error } = useListener(form, name);

  return (
    <RebassInput
      as={ReactFormInput}
      form={form as any}
      name={name}
      variant={error ? 'error' : 'input'}
      {...rest}
    >
      {children}
    </RebassInput>
  );
};
