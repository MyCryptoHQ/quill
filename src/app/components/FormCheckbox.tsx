import React from 'react';

import { FormState, useListener } from 'typed-react-form';

import { Checkbox } from './Checkbox';

export const FormCheckbox = <T extends unknown>({
  form,
  name,
  ...rest
}: {
  form: FormState<T>;
  name: keyof T;
}) => {
  const { value, setValue } = useListener(form, name);
  const handleChange = () => setValue(!value as any);

  return <Checkbox checked={value as any} onChange={handleChange} {...rest} />;
};
