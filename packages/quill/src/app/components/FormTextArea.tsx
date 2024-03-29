import type { TextareaProps } from '@mycrypto/ui';
import { Textarea as RebassTextArea } from '@mycrypto/ui';
import type { DefaultError, DefaultState } from 'typed-react-form';
import { FormTextArea as ReactFormTextArea, useListener } from 'typed-react-form';
import type { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

export const FormTextArea = <
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
  Omit<TextareaProps, 'form'> & FormInputProps<T, State, Error, Key, Value>,
  'as' | 'variant'
>) => {
  const { error } = useListener(form, name);

  return (
    <RebassTextArea
      as={ReactFormTextArea}
      form={(form as unknown) as string}
      name={name}
      hasError={error != undefined}
      {...rest}
    >
      {children}
    </RebassTextArea>
  );
};
