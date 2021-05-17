import { translateRaw } from '@common/translate';
import { InfoBannerType, TxResult } from '@types';

import { Banner } from '.';

const configs = {
  [TxResult.WAITING]: {
    type: 'action',
    label: translateRaw('TX_RESULT_WAITING_LABEL')
  },
  [TxResult.DENIED]: {
    type: 'info',
    label: translateRaw('TX_RESULT_DENIED_LABEL')
  },
  [TxResult.APPROVED]: {
    type: 'success',
    label: translateRaw('TX_RESULT_APPROVED_LABEL')
  },
  [InfoBannerType.NONCE_CONFLICT_IN_QUEUE]: {
    type: 'warning',
    label: translateRaw('NONCE_CONFLICT_IN_QUEUE')
  },
  [InfoBannerType.NONCE_ADJUSTED]: {
    type: 'warning',
    label: translateRaw('NONCE_CHANGED')
  },
  [InfoBannerType.NONCE_OUT_OF_ORDER]: {
    type: 'warning',
    label: translateRaw('NONCE_OUT_OF_ORDER')
  }
} as const;

// @todo: Add accordion
export const TxInfoBanner = ({ type }: { type: InfoBannerType | TxResult }) => {
  const { type: bannerType, label } = configs[type];

  return <Banner type={bannerType} label={label} />;
};
