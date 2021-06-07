import type { DefaultError, DefaultState } from 'typed-react-form';
import { useListener } from 'typed-react-form';
import type { FormInputProps } from 'typed-react-form/dist/elements/FormInput';

import type { BoxProps } from '@components';

import { FileBox } from './FileBox';

export const FormFileInput = <
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
  const { error, setValue } = (useListener(form, name) as unknown) as {
    error: string;
    setValue(value: File): void;
  };

  const handleChange = (f: File) => setValue(f);

  return <FileBox {...rest} onChange={handleChange} error={error !== undefined} />;
};
