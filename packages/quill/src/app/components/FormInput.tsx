import { Input as RebassInput } from '@rebass/forms/styled-components';
import type { ChangeEvent, ComponentProps, KeyboardEvent, WheelEvent } from 'react';
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
  processInput,
  ...rest
}: Omit<
  Omit<ComponentProps<typeof RebassInput>, 'form'> & FormInputProps<T, State, Error, Key, Value>,
  'as' | 'variant'
> & { processInput?(val: string): string }) => {
  const { error, setValue } = useListener(form, name);

  const handleWheel = (e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur();
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const processed = processInput ? processInput(value) : value;
    setValue((processed as unknown) as T[string & Key]);
  };

  return (
    <RebassInput
      as={ReactFormInput}
      form={(form as unknown) as string}
      name={name}
      variant={error ? 'error' : 'input'}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      {...rest}
    >
      {children}
    </RebassInput>
  );
};
