import React, { FormEvent } from 'react';

import { literal, object } from 'superstruct';
import { FormError, useForm } from 'typed-react-form';

import { getValidator } from '@app/utils';
import { Body, Box, Button, FormInput, Heading, IFlowComponentProps, Label } from '@components';
import { getGeneratedMnemonicWords, useSelector } from '@store';
import { translate, translateRaw } from '@translations';

export const GenerateAccountVerify = ({ onNext }: IFlowComponentProps) => {
  const mnemonicWords = useSelector(getGeneratedMnemonicWords);

  // @todo Use yup for form validation
  const MnemonicWordsStruct = object({
    sixthWord: literal(mnemonicWords[5]),
    eighthWord: literal(mnemonicWords[7]),
    twelfthWord: literal(mnemonicWords[11])
  });

  const form = useForm(
    {
      sixthWord: '',
      eighthWord: '',
      twelfthWord: ''
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
          <Label htmlFor="sixthWord">
            <Body>{translate('WHAT_IS_6TH_WORD')}</Body>
          </Label>
          <FormInput id="sixthWord" name="sixthWord" form={form} />
          <FormError name="sixthWord" form={form} />
        </Box>
        <Box mt="3">
          <Label htmlFor="eighthWord">
            <Body>{translate('WHAT_IS_8TH_WORD')}</Body>
          </Label>
          <FormInput id="eighthWord" name="eighthWord" form={form} />
          <FormError name="eighthWord" form={form} />
        </Box>
        <Box mt="3">
          <Label htmlFor="twelfthWord">
            <Body>{translate('WHAT_IS_12TH_WORD')}</Body>
          </Label>
          <FormInput id="twelfthWord" name="twelfthWord" form={form} />
          <FormError name="twelfthWord" form={form} />
        </Box>
        <Button mt="4" type="submit" mb="3">
          {translateRaw('VERIFY_WORDS')}
        </Button>
      </form>
    </Box>
  );
};
