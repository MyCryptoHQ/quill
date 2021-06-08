import { Body, Button, Heading } from '@mycrypto/ui';
import { generateAccount, getGeneratedMnemonicWords, translateRaw } from '@signer/common';
import { useEffect } from 'react';

import refresh from '@app/assets/icons/refresh.svg';
import type { IFlowComponentProps } from '@components';
import { Box, Flex, Image, Input, Link, PanelBottom, ScrollableContainer } from '@components';
import { useDispatch, useSelector } from '@store';
import { translate } from '@translations';

interface WordProps {
  index: number;
  children: string;
}

const Word = ({ index, children }: WordProps) => (
  <Flex
    p="10px"
    sx={{
      border: '1px solid',
      borderColor: 'GREY_ATHENS'
    }}
  >
    <Body mx="6px" sx={{ userSelect: 'none' }}>
      {index}.
    </Body>
    <Input variant="none" disabled={true} value={children} />
  </Flex>
);

export const GenerateAccountMnemonic = ({ onNext, flowHeader }: IFlowComponentProps) => {
  const dispatch = useDispatch();
  const mnemonicWords = useSelector(getGeneratedMnemonicWords);

  const handleGenerate = () => {
    dispatch(generateAccount());
  };

  useEffect(() => {
    if (!mnemonicWords) {
      handleGenerate();
    }
  }, []);

  return (
    <>
      <ScrollableContainer>
        {flowHeader}
        <Box sx={{ textAlign: 'center' }} mb="4">
          <Heading fontSize="24px" lineHeight="150%" mb="2">
            {translateRaw('CREATE_MNEMONIC_PHRASE_TITLE')}
          </Heading>
          <Body>{translate('CREATE_MNEMONIC_PHRASE_DESCRIPTION')}</Body>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridGap: '16px',
            gridTemplateColumns: '1fr 1fr'
          }}
        >
          {mnemonicWords &&
            mnemonicWords.map((word, index) => (
              <Word key={`word-${index}`} index={index + 1}>
                {word}
              </Word>
            ))}
        </Box>
      </ScrollableContainer>
      <PanelBottom>
        <Button onClick={onNext} mb="3">
          {translateRaw('CONFIRM_MNEMONIC_PHRASE')}
        </Button>
        <Link variant="defaultLink" onClick={handleGenerate}>
          <Flex variant="horizontal-center">
            <Image alt="Regenerate" src={refresh} width="20px" height="20px" mr="2" />
            {translateRaw('REGENERATE_MNEMONIC_PHRASE')}
          </Flex>
        </Link>
      </PanelBottom>
    </>
  );
};
