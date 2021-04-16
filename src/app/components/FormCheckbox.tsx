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
  const { value, setValue } = (useListener(form, name) as unknown) as {
    value: boolean;
    setValue(value: boolean): void;
  };
  const handleChange = () => setValue(!value);

  return <Checkbox checked={value} onChange={handleChange} {...rest} />;
};
