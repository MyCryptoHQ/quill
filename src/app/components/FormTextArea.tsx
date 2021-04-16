import { Textarea as RebassTextArea, TextareaProps } from '@rebass/forms/styled-components';
import {
  DefaultError,
  DefaultState,
  FormTextArea as ReactFormTextArea,
  useListener
} from 'typed-react-form';
import { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

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
      form={form as any}
      name={name}
      variant={error ? 'error' : 'textarea'}
      {...rest}
    >
      {children}
    </RebassTextArea>
  );
};
