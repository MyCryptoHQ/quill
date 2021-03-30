import React from 'react';

import mnemonicPhrase from '@app/assets/icons/mnemonic-phrase.svg';
import { Box, Button, Heading, IFlowComponentProps, Image, List, ListItem } from '@components';
import { translateRaw } from '@translations';

export const GenerateAccountStart = ({ onNext }: IFlowComponentProps) => (
  <Box>
    <Box sx={{ textAlign: 'center' }}>
      <Heading fontSize="24px" lineHeight="150%" mb="4">
        {translateRaw('GENERATE_ACCOUNT_MNEMONIC')}
      </Heading>
      <Image alt="Mnemonic Phrase" src={mnemonicPhrase} width="100px" height="100px" mb="3" />
    </Box>
    <List>
      <ListItem>{translateRaw('MNEMONIC_DESCRIPTION_1')}</ListItem>
      <ListItem>{translateRaw('MNEMONIC_DESCRIPTION_2')}</ListItem>
      <ListItem>{translateRaw('MNEMONIC_DESCRIPTION_3')}</ListItem>
      <ListItem>{translateRaw('MNEMONIC_DESCRIPTION_4')}</ListItem>
      <ListItem>{translateRaw('MNEMONIC_DESCRIPTION_5')}</ListItem>
    </List>
    <Button onClick={onNext} mb="3">
      {translateRaw('CREATE_MNEMONIC_PHRASE')}
    </Button>
  </Box>
);
