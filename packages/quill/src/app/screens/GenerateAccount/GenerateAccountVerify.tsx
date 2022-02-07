import { Body, Button, SubHeading } from '@mycrypto/ui';
import { getGeneratedMnemonicWords, getRandomNumbers, translateRaw } from '@quill/common';
import type { FormEvent } from 'react';
import { useMemo } from 'react';
import { useForm, yupValidator } from 'typed-react-form';
import { object, string } from 'yup';

import type { IFlowComponentProps } from '@components';
import { Box, Container, FormError, FormInput, Label, PanelBottom } from '@components';
import { useSelector } from '@store';
import { translate } from '@translations';

export const GenerateAccountVerify = ({ onNext, flowHeader }: IFlowComponentProps) => {
  const mnemonicWords = useSelector(getGeneratedMnemonicWords);
  const [first, second, third] = useMemo(() => getRandomNumbers(mnemonicWords.length, 3), []);

  const MnemonicWordsSchema = object({
    firstWord: string().is(
      [mnemonicWords[first]],
      translateRaw('NOT_NTH_WORD', { $nth: translateRaw(`ORDINAL_${first + 1}`) })
    ),
    secondWord: string().is(
      [mnemonicWords[second]],
      translateRaw('NOT_NTH_WORD', { $nth: translateRaw(`ORDINAL_${second + 1}`) })
    ),
    thirdWord: string().is(
      [mnemonicWords[third]],
      translateRaw('NOT_NTH_WORD', { $nth: translateRaw(`ORDINAL_${third + 1}`) })
    )
  });

  const form = useForm(
    {
      firstWord: '',
      secondWord: '',
      thirdWord: ''
    },
    yupValidator(MnemonicWordsSchema, {
      abortEarly: false
    }),
    true
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
    <>
      <Container>
        {flowHeader}
        <Box sx={{ textAlign: 'center' }} mb="3">
          <SubHeading mb="2">{translateRaw('VERIFY_MNEMONIC_PHRASE_TITLE')}</SubHeading>
          <Body>{translate('VERIFY_MNEMONIC_PHRASE_DESCRIPTION')}</Body>
        </Box>
        <form onSubmit={handleSubmit} id="mnemonic-phrase-verify-form">
          <Box mt="2">
            <Label htmlFor="firstWord">
              <Body>
                {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${first + 1}`) })}
              </Body>
            </Label>
            <FormInput id="firstWord" name="firstWord" data-testid="firstWord" form={form} />
            <FormError name="firstWord" form={form} />
          </Box>
          <Box mt="2">
            <Label htmlFor="secondWord">
              <Body>
                {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${second + 1}`) })}
              </Body>
            </Label>
            <FormInput id="secondWord" name="secondWord" data-testid="secondWord" form={form} />
            <FormError name="secondWord" form={form} />
          </Box>
          <Box mt="2">
            <Label htmlFor="thirdWord">
              <Body>
                {translate('WHAT_IS_NTH_WORD', { $nth: translateRaw(`ORDINAL_${third + 1}`) })}
              </Body>
            </Label>
            <FormInput id="thirdWord" name="thirdWord" data-testid="thirdWord" form={form} />
            <FormError name="thirdWord" form={form} />
          </Box>
        </form>
      </Container>
      <PanelBottom variant="clear">
        <Button type="submit" form="mnemonic-phrase-verify-form">
          {translateRaw('VERIFY_WORDS')}
        </Button>
      </PanelBottom>
    </>
  );
};
