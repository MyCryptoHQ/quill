import { Body, Flex, Image, SubHeading } from '@mycrypto/ui';
import type { TxHistoryEntry } from '@quill/common';
import { getCurrentTransaction, translateRaw } from '@quill/common';

import {
  Box,
  CopyableText,
  ExtendableButton,
  LinkApp,
  QR,
  ScrollableContainer
} from '@app/components';
import { ROUTE_PATHS } from '@app/routing';
import { useSelector } from '@app/store';
import { translate } from '@app/translations';
import back from '@assets/icons/back.svg';

export const ViewSignedTransaction = () => {
  const currentTx = useSelector(getCurrentTransaction);
  const { signedTx } = currentTx as TxHistoryEntry;

  return (
    <ScrollableContainer>
      <Box>
        <Box mb="2">
          <LinkApp href={ROUTE_PATHS.TX} variant="barren">
            <Flex variant="horizontal-start">
              <Image alt="Back" src={back} width="12px" height="10px" />
              <Body ml="2" color="LIGHT_BLUE">
                {translateRaw('TX_SUMMARY')}
              </Body>
            </Flex>
          </LinkApp>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <SubHeading mt="3" mb="2">
            {translateRaw('VIEW_SIGNED_TX_HEADER')}
          </SubHeading>
        </Box>
        <Body mb="4">{translate('VIEW_SIGNED_TX_DESCRIPTION')}</Body>
        {signedTx && (
          <ExtendableButton
            title={translateRaw('SHOW_SIGNED_TRANSACTION')}
            extendedTitle={translateRaw('HIDE_SIGNED_TRANSACTION')}
            extended={true}
          >
            <CopyableText>{signedTx}</CopyableText>
            {/* @todo: Test how much data can fit into QR */}
            <QR data={signedTx} size="200px" mt="2" mx="auto" display="block" />
          </ExtendableButton>
        )}
      </Box>
    </ScrollableContainer>
  );
};
