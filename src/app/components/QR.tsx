import { Image } from '@mycrypto/ui';
import qruri from 'qruri';
import { useEffect, useState } from 'react';

interface QRProps {
  data: string;
  size?: number | string;
}

export const QR = ({ data, size }: QRProps) => {
  const [image, setImage] = useState<string>();

  console.log(qruri);

  useEffect(() => {
    setImage(
      qruri(data, {
        ecclevel: 'M',
        margin: 0
      })
    );
  }, [data]);

  if (image) {
    return <Image src={image} alt="QR" size={size} />;
  }

  return null;
};
