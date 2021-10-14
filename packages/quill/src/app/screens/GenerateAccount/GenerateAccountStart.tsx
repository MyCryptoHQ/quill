import { Button, Heading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import mnemonicPhrase from '@app/assets/icons/mnemonic-phrase.svg';
import type { IFlowComponentProps } from '@components';
import { Box, Container, Image, List, ListItem, PanelBottom } from '@components';

export const GenerateAccountStart = ({ onNext, flowHeader }: IFlowComponentProps) => (
  <>
    <Container>
      {flowHeader}
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
    </Container>
    <PanelBottom variant="clear">
      <Button onClick={onNext}>{translateRaw('CREATE_MNEMONIC_PHRASE')}</Button>
    </PanelBottom>
  </>
);
