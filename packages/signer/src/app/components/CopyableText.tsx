import { Body, Box, Flex, Image } from '@mycrypto/ui';
import { useEffect, useState } from 'react';

import checkmark from '@assets/icons/checkmark.svg';
import copy from '@assets/icons/copy.svg';

export interface CopyableTextProps {
  children: string;
}

export const CopyableText = ({ children }: CopyableTextProps) => {
  const [icon, setIcon] = useState(copy);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setIcon(checkmark);
  };

  useEffect(() => {
    if (icon === checkmark) {
      const timeout = setTimeout(() => {
        setIcon(copy);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [icon]);

  return (
    <Flex variant="horizontal-align" backgroundColor="badge.muted" p="3">
      <Box>
        <Body sx={{ wordBreak: 'break-word' }}>{children}</Body>
      </Box>
      <Box ml="3" minWidth="13px">
        <Image
          data-testid="copy-button"
          src={icon}
          width="13px"
          height="13px"
          sx={{ cursor: 'pointer' }}
          onClick={handleCopy}
        />
      </Box>
    </Flex>
  );
};
