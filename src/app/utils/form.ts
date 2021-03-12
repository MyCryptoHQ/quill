import { Struct, StructError } from 'superstruct';
import { ErrorMap, Validator } from 'typed-react-form';

export const toErrorMap = <T>([error]: [StructError | undefined, T]): ErrorMap<T, string> => {
  if (error) {
    return error.failures().reduce<ErrorMap<T, string>>((errors, failure) => {
      return {
        ...errors,
        [failure.key]: failure.message
      };
    }, {});
  }

  return {};
};

export const getValidator = <T, S>(struct: Struct<T, S>): Validator<T, string> => {
  return (values: T) => toErrorMap(struct.validate(values));
};
