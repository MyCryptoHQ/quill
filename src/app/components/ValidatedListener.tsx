import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { FormState } from 'typed-react-form';
import { useAnyListener } from 'typed-react-form';

export const ValidatedListener = <T,>({
  form,
  render
}: {
  form: FormState<T>;
  render(values: T): ReactNode;
}) => {
  const [validatedValues, setValidatedValues] = useState(Object.assign({}, form.values));
  return (
    <ValidatedListenerInner
      form={form}
      render={render}
      validatedValues={validatedValues}
      setValidatedValues={setValidatedValues}
    />
  );
};

const ValidatedListenerInner = <T,>({
  form,
  validatedValues,
  setValidatedValues,
  render
}: {
  form: FormState<T>;
  validatedValues: T;
  setValidatedValues(values: T): void;
  render(values: T): ReactNode;
}) => {
  const { values } = useAnyListener(form);

  useEffect(() => {
    form.validate().then((result) => {
      if (result) setValidatedValues(Object.assign({}, values));
    });
  }, [values]);

  return <>{render(validatedValues)}</>;
};
