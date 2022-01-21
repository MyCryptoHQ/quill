import { Body, Flex, Image } from '@mycrypto/ui';
import {
  getApprovedTransactionsLength,
  getDeniedTransactionsLength,
  getQueueLength,
  translateRaw
} from '@quill/common';

import { useSelector } from '@app/store';
import approved from '@assets/icons/circle-checkmark.svg';
import denied from '@assets/icons/queue-denied.svg';
import pending from '@assets/icons/queue-waiting.svg';

export const TxHistoryStats = () => {
  const queueLength = useSelector(getQueueLength);
  const approvedLength = useSelector(getApprovedTransactionsLength);
  const deniedLength = useSelector(getDeniedTransactionsLength);

  return (
    <Flex justifyContent="space-around" mt="1" mb="2" p="2" bg="rgba(232, 234, 237, 0.3)">
      <Flex alignItems="center">
        <Image height="20px" width="20px" src={pending} mr="8px" />
        <Body fontSize="1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {translateRaw('PENDING')}{' '}
          <Body fontSize="inherit" fontWeight="inherit" as="span" color="text.discrete">
            ({queueLength})
          </Body>
        </Body>
      </Flex>
      <Flex alignItems="center">
        <Image height="20px" width="20px" src={approved} mr="8px" />
        <Body fontSize="1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {translateRaw('APPROVED')}{' '}
          <Body fontSize="inherit" fontWeight="inherit" as="span" color="text.discrete">
            ({approvedLength})
          </Body>
        </Body>
      </Flex>
      <Flex alignItems="center">
        <Image height="20px" width="20px" src={denied} mr="8px" />
        <Body fontSize="1" fontWeight="bold" sx={{ textTransform: 'uppercase' }}>
          {translateRaw('DENIED')}{' '}
          <Body fontSize="inherit" fontWeight="inherit" as="span" color="text.discrete">
            ({deniedLength})
          </Body>
        </Body>
      </Flex>
    </Flex>
  );
};
