import { Body, Button, Heading } from '@mycrypto/ui';
import { translateRaw } from '@quill/common';

import mnemonicPhrase from '@app/assets/icons/mnemonic-phrase.svg';
import type { IFlowComponentProps } from '@components';
import { Box, Container, Image, List, ListItem, PanelBottom } from '@components';
import { translate } from '@translations';

export const GenerateAccountStart = ({ onNext, flowHeader }: IFlowComponentProps) => (
  <>
    <Container>
      {flowHeader}
      <Box sx={{ textAlign: 'center' }}>
        <Heading fontSize="24px" lineHeight="150%" mb="4">
          {translateRaw('GENERATE_ACCOUNT_MNEMONIC')}
        </Heading>
        <Image alt="Mnemonic Phrase" src={mnemonicPhrase} width="62px" height="80px" mb="3" />
      </Box>
      <Body>{translate('MNEMONIC_DESCRIPTION_1')}</Body>
      <List pl="0">
        <ListItem mb="1">{translateRaw('MNEMONIC_DESCRIPTION_2')}</ListItem>
        <ListItem mb="1">{translateRaw('MNEMONIC_DESCRIPTION_3')}</ListItem>
        <ListItem mb="1">{translateRaw('MNEMONIC_DESCRIPTION_4')}</ListItem>
      </List>
    </Container>
    <PanelBottom variant="clear">
      <Button onClick={onNext}>{translateRaw('CREATE_MNEMONIC_PHRASE')}</Button>
    </PanelBottom>
  </>
);
