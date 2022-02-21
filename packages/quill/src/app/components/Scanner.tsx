import { Body, Box, Flex, Spinner } from '@mycrypto/ui';
import { isRawTransaction, translateRaw } from '@quill/common';
import type { FunctionComponent } from 'react';
import { useRef, useState } from 'react';

import { useScanner } from '@hooks/useScanner';

interface ScannerProps {
  onScan(signedTransaction: string): void;
}

export const Scanner: FunctionComponent<ScannerProps> = ({ onScan }) => {
  const [decodeError, setDecodeError] = useState('');

  const handleDecode = ({ data }: { data: string }) => {
    if (isRawTransaction(data)) {
      setDecodeError('');
      return onScan(data);
    }

    setDecodeError(translateRaw('INVALID_SIGNED_TRANSACTION_QR'));
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const { isLoading, error } = useScanner(videoRef, handleDecode);

  return (
    <Flex
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      data-testid="scanner"
    >
      <Box
        width="100%"
        sx={{
          position: 'relative',
          svg: {
            stroke: '#a086f7 !important'
          }
        }}
      >
        {(error || decodeError) && <Body variant="error">{error || decodeError}</Body>}
        <Box as="video" width="100%" ref={videoRef} />
        {isLoading && (
          <Flex
            justifyContent="center"
            alignItems="center"
            sx={{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '0' }}
          >
            <Spinner size={3} color="PURPLE" />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};
