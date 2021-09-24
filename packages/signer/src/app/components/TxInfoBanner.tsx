import { InfoBannerType, translateRaw, TxResult } from '@signer/common';
import type { BannerType } from '@signer/common';
import type { ReactElement } from 'react';

import { Banner } from './index';

const configs: {
  [key in TxResult | InfoBannerType]: {
    type: BannerType;
    label: string;
    content?: string | ReactElement;
  };
} = {
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
  [InfoBannerType.NONCE_CONFLICT]: {
    type: 'warning',
    label: translateRaw('NONCE_CONFLICT')
  },
  [InfoBannerType.NONCE_OUT_OF_ORDER]: {
    type: 'warning',
    label: translateRaw('NONCE_OUT_OF_ORDER'),
    // @todo: Somehow pass link to this
    content: translateRaw('NONCE_OUT_OF_ORDER_CONTENT')
  }
};

export const TxInfoBanner = ({ type }: { type: InfoBannerType | TxResult }) => {
  const config = configs[type];

  return (
    <Banner type={config.type} label={config.label}>
      {config.content}
    </Banner>
  );
};
