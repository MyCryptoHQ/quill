import React, { FormEvent, useMemo } from 'react';

import { literal, object } from 'superstruct';
import { FormError, useForm } from 'typed-react-form';

import { getValidator } from '@app/utils';
import { Body, Box, Button, FormInput, Heading, IFlowComponentProps, Label } from '@components';
import { getGeneratedMnemonicWords, useSelector } from '@store';
import { translate, translateRaw } from '@translations';
import { getRandomNumbers } from '@utils/random';

export const GenerateAccountVerify = ({ onNext }: IFlowComponentProps) => {
  const mnemonicWords = useSelector(getGeneratedMnemonicWords);
  const [first, second, third] = useMemo(() => getRandomNumbers(24, 3), []);

  // @todo Use yup for form validation
  const MnemonicWordsStruct = object({
    firstWord: literal(mnemonicWords[first]),
    secondWord: literal(mnemonicWords[second]),
    thirdWord: literal(mnemonicWords[third])
  });

  const form = useForm(
    {
      firstWord: '',
      secondWord: '',
      thirdWord: ''
    },
    getValidator(MnemonicWordsStruct)
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await form.validate();
    if (form.error) {
      return;
    }

    onNext();
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center' }} mb="4">
        <Heading fontSize="24px" lineHeight="150%" mb="2">
          {translateRaw('VERIFY_MNEMONIC_PHRASE_TITLE')}
        </Heading>
        {/* @todo Update this copy */}
        <Body>{translate('VERIFY_MNEMONIC_PHRASE_DESCRIPTION')}</Body>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box mt="3">
          <Label htmlFor="firstWord">
            <Body>
              {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${first + 1}`) })}
            </Body>
          </Label>
          <FormInput id="firstWord" name="firstWord" data-testid="firstWord" form={form} />
          <FormError name="firstWord" form={form} />
        </Box>
        <Box mt="3">
          <Label htmlFor="secondWord">
            <Body>
              {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${second + 1}`) })}
            </Body>
          </Label>
          <FormInput id="secondWord" name="secondWord" data-testid="secondWord" form={form} />
          <FormError name="secondWord" form={form} />
        </Box>
        <Box mt="3">
          <Label htmlFor="thirdWord">
            <Body>
              {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${third + 1}`) })}
            </Body>
          </Label>
          <FormInput id="thirdWord" name="thirdWord" data-testid="thirdWord" form={form} />
          <FormError name="thirdWord" form={form} />
        </Box>
        <Button mt="4" type="submit" mb="3">
          {translateRaw('VERIFY_WORDS')}
        </Button>
      </form>
    </Box>
  );
};
