import { Body } from '@mycrypto/ui';
import type { DefaultError, DefaultState } from 'typed-react-form';
import { useListener } from 'typed-react-form';
import type { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

import type { BoxProps } from '@components';

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
}: Omit<Omit<BoxProps, 'form'> & FormInputProps<T, State, Error, Key, Value>, 'as'>) => {
  const { error } = useListener(form, name);

  return (
    <Body variant="error" {...rest}>
      {error}
    </Body>
  );
};
