import { Body, Box, Flex, Image } from '@mycrypto/ui';

import copy from '@assets/icons/copy.svg';

export interface CopyableTextProps {
  children: string;
}

export const CopyableText = ({ children }: CopyableTextProps) => {
  const handleCopy = () => navigator.clipboard.writeText(children);

  return (
    <Flex variant="horizontal-align" backgroundColor="badge.muted" p="3">
      <Box>
        <Body sx={{ wordBreak: 'break-word' }}>{children}</Body>
      </Box>
      <Box ml="3" minWidth="13px">
        <Image
          src={copy}
          width="13px"
          height="13px"
          sx={{ cursor: 'pointer' }}
          onClick={handleCopy}
        />
      </Box>
    </Flex>
  );
};
