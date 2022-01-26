import type { BoxProps } from '@mycrypto/ui';
import { Body, Box, PasswordStrength } from '@mycrypto/ui';
import type { DefaultError, DefaultState, FormInputProps } from 'typed-react-form';
import { useListener } from 'typed-react-form';
import zxcvbn from 'zxcvbn';

export const FormPasswordStrength = <
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
  const { error, value } = useListener(form, name);
  const result = zxcvbn((value as unknown) as string);
  const strength = Math.max(result.score - 1, 0);
  const warning = result.feedback.warning;

  return (
    <Box mt="2" {...rest}>
      <PasswordStrength strength={strength} height="6px" />
      <Body fontSize="1" lineHeight="14px" mt="2">
        {warning.length > 0 ? warning : error}
      </Body>
    </Box>
  );
};
