import { Body } from '@mycrypto/ui';

import approved from '@assets/icons/circle-checkmark.svg';
import warning from '@assets/icons/circle-warning.svg';
import denied from '@assets/icons/queue-denied.svg';
import waiting from '@assets/icons/queue-waiting.svg';
import { translateRaw } from '@common/translate';
import { TxResult } from '@types';

import { Box, Image } from '.';

export enum InfoType {
  NONCE_CONFLICT_IN_QUEUE = 'NONCE_CONFLICT_IN_QUEUE'
}

const configs = {
  [TxResult.WAITING]: {
    bg: 'rgba(166, 130, 255, 0.15)',
    color: 'PURPLE',
    icon: waiting,
    label: translateRaw('TX_RESULT_WAITING_LABEL')
  },
  [TxResult.DENIED]: {
    bg: 'rgba(181, 191, 199, 0.15)',
    color: 'BLUE_GREY',
    icon: denied,
    label: translateRaw('TX_RESULT_DENIED_LABEL')
  },
  [TxResult.APPROVED]: {
    bg: 'rgba(179, 221, 135, 0.15)',
    color: 'GREEN',
    icon: approved,
    label: translateRaw('TX_RESULT_APPROVED_LABEL')
  },
  [InfoType.NONCE_CONFLICT_IN_QUEUE]: {
    bg: 'rgba(250, 135, 63, 0.15)',
    color: 'ORANGE',
    icon: warning,
    label: translateRaw('NONCE_CONFLICT_IN_QUEUE')
  }
};

export const TxInfoBanner = ({ type }: { type: InfoType | TxResult }) => {
  const { bg, color, icon, label } = configs[type];
  return (
    <Box bg={bg} sx={{ borderRadius: '3px' }} variant="horizontal-start" p="2" mb="2">
      <Image src={icon} height="20px" width="20px" mr="2" />
      <Body color={color} fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Body>
    </Box>
  );
};
