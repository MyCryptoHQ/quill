import { Box } from '@mycrypto/ui';
import QRCode from 'qrcode.react';

import type { BoxProps } from '.';

interface QRProps {
  data: string;
  size?: number;
  imageSrc?: string;
}

export const QR = ({ data, size, imageSrc, ...props }: QRProps & BoxProps) => {
  console.log(imageSrc);

  return (
    <Box {...props}>
      <QRCode
        value={data}
        size={size}
        level="M"
        imageSettings={
          imageSrc
            ? {
                src: imageSrc,
                width: 50,
                height: 20,
                excavate: true,
                x: null,
                y: null
              }
            : undefined
        }
      />
    </Box>
  );
};
