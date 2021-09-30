import { Body } from '@mycrypto/ui';
import { translateRaw } from '@signer/common';
import type { MouseEvent } from 'react';
import { useState } from 'react';

import { Box, TextSelector } from '@app/components';
import lockIcon from '@assets/icons/lock.svg';

import { SettingsAccordion } from './SettingsAccordion';

export const AutoLockSettings = () => {
  const options = [
    { label: translateRaw('ELAPSED_TIME_MINUTE', { $value: '1' }), value: 60000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '3' }), value: 180000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '5' }), value: 300000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '10' }), value: 600000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '15' }), value: 900000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '30' }), value: 1800000 },
    { label: translateRaw('ELAPSED_TIME_MINUTES', { $value: '45' }), value: 2700000 },
    { label: translateRaw('ELAPSED_TIME_HOUR', { $value: '1' }), value: 3600000 },
    { label: translateRaw('ELAPSED_TIME_HOURS', { $value: '3' }), value: 10800000 },
    { label: translateRaw('ELAPSED_TIME_HOURS', { $value: '6' }), value: 21600000 },
    { label: translateRaw('ELAPSED_TIME_HOURS', { $value: '12' }), value: 43200000 }
  ];

  const [state, setState] = useState(options[3]);

  const handlePropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <SettingsAccordion icon={lockIcon} label="Auto-Lock Timer">
      <Body>
        The inactivity timer functionality locks the Signer after you have been idle for a specified
        period of time. Note: Your password is required to unlock.
      </Body>
      <Body mt="2">Lock the Signer after I've been inactive for:</Body>
      <Box mt="2" onClick={handlePropagation}>
        <TextSelector options={options} value={state} onChange={setState} />
      </Box>
    </SettingsAccordion>
  );
};
