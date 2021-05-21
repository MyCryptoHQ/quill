import { formatEther, formatUnits } from '@ethersproject/units';
import { Body } from '@mycrypto/ui';

import warning from '@assets/icons/circle-warning.svg';
import { translateRaw } from '@common/translate';
import { bigify } from '@common/utils';
import { getChain } from '@data';
import type { TxHistoryEntry, TxQueueEntry } from '@types';

import { Box, Image, QR } from '.';
import { CodeBlock } from './CodeBlock';
import { TxDetailsBlockRow as BlockRow } from './TxDetailsBlockRow';
import { TxDetailsRow as Row } from './TxDetailsRow';

export const TxDetails = ({
  tx: { tx, adjustedNonce, signedTx, offline }
}: {
  tx: TxQueueEntry | TxHistoryEntry;
}) => {
  const chain = getChain(tx.chainId);
  const maxTxFee = bigify(tx.gasPrice).multipliedBy(bigify(tx.gasLimit));
  const symbol = chain?.nativeCurrency?.symbol ?? '?';
  const network = chain?.name ?? translateRaw('UNKNOWN_NETWORK');
  const data = tx.data?.toString() ?? '0x';

  return (
    <>
      {/* @todo Update design */}
      {offline && signedTx && (
        <BlockRow label={translateRaw('SIGNED_TRANSACTION')}>
          <CodeBlock>{signedTx}</CodeBlock>
          <QR data={signedTx} size="200px" mt="2" mx="auto" display="block" />
        </BlockRow>
      )}

      {/** @todo Consider units */}
      <Row label={translateRaw('TX_DETAILS_AMOUNT')} value={`${formatEther(tx.value)} ${symbol}`} />
      <Row label={translateRaw('NETWORK')} value={`${network} (${tx.chainId.toString()})`} />
      <Row label={translateRaw('GAS_LIMIT')} value={bigify(tx.gasLimit).toString()} />
      <Row label={translateRaw('GAS_PRICE')} value={`${formatUnits(tx.gasPrice, 'gwei')} Gwei`} />
      <Row
        label={translateRaw('MAX_TX_FEE')}
        value={`${formatEther(maxTxFee.toString())} ${symbol}`}
      />
      <Row
        label={translateRaw('NONCE')}
        value={
          <Box variant="horizontal-start">
            <Body>{bigify(tx.nonce).toString()}</Body>
            {adjustedNonce && <Image ml="2" src={warning} height="20px" width="20px" />}
          </Box>
        }
        info={
          adjustedNonce && <Body color="text.warning">{translateRaw('NONCE_CHANGED_HELP')}</Body>
        }
      />
      {data === '0x' ? (
        <Row label={translateRaw('DATA')} value={translateRaw('TX_DETAILS_DATA_EMPTY')} />
      ) : (
        <BlockRow label={translateRaw('DATA')} hideDivider={true}>
          <CodeBlock>{data}</CodeBlock>
        </BlockRow>
      )}
    </>
  );
};
