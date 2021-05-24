import type { InputProps } from '@mycrypto/ui';
import { Input as RebassInput } from '@mycrypto/ui';
import type { DefaultError, DefaultState } from 'typed-react-form';
import { FormInput as ReactFormInput, useListener } from 'typed-react-form';
import type { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

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
      form={(form as unknown) as string}
      name={name}
      variant={error ? 'error' : 'input'}
      {...rest}
    >
      {children}
    </RebassInput>
  );
};
