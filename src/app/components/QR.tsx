import React, { useEffect, useState } from 'react';

import { AwesomeQR, QRErrorCorrectLevel } from 'awesome-qr';
import { Image } from 'rebass';

import { ImageProps } from '@components';

interface Props {
  size: number;
  data: string;
}

export const QR = ({
  data,
  size,
  ...props
}: Props & Omit<ImageProps, 'src' | 'width' | 'height'>) => {
  const [url, setURL] = useState<string>();

  useEffect(() => {
    new AwesomeQR({
      text: data,
      size,
      correctLevel: QRErrorCorrectLevel.M,
      margin: 0,
      components: {
        data: {
          scale: 1
        },
        timing: {
          scale: 1
        },
        alignment: {
          scale: 1
        },
        cornerAlignment: {
          scale: 1
        }
      }
    })
      .draw()
      .then((url) => setURL(url as string));
  }, [data]);

  return <Image src={url} width={`${size}px`} height={`${size}px`} {...props} />;
};
