import { Body, Box, Flex } from '@mycrypto/ui';
import { isRawTransaction, translateRaw } from '@quill/common';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import type { OnResultFunction } from 'react-qr-reader';
import { QrReader } from 'react-qr-reader';

interface ScannerProps {
  onScan(signedTransaction: string): void;
}

export const Scanner: FunctionComponent<ScannerProps> = ({ onScan }) => {
  const [error, setError] = useState('');

  const handleDecode: OnResultFunction = (data) => {
    setError('');

    if (data) {
      const text = data.getText();
      if (isRawTransaction(text)) {
        return onScan(text);
      }

      setError(translateRaw('INVALID_RAW_TRANSACTION_QR'));
    }
  };

  return (
    <Flex
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      data-testid="scanner"
    >
      <Box width="100%">
        <QrReader
          constraints={{ facingMode: 'environment', aspectRatio: { ideal: 1 } }}
          onResult={handleDecode}
          containerStyle={{ width: '80%', margin: 'auto' }}
        />
        {error && <Body variant="error">{error}</Body>}
      </Box>
    </Flex>
  );
};
