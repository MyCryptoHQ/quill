import { Body } from '@mycrypto/ui';
import { getAutoLockTimeout, setAutoLockTimeout, translateRaw } from '@signer/common';
import type { MouseEvent } from 'react';

import type { OptionType } from '@app/components';
import { Box, TextSelector } from '@app/components';
import { useDispatch, useSelector } from '@app/store';
import lockIcon from '@assets/icons/lock.svg';

import { SettingsAccordion } from './SettingsAccordion';

export const AutoLockSettings = () => {
  const options = [
    { label: translateRaw('TIME_MINUTE', { $value: '1' }), value: 60000 },
    { label: translateRaw('TIME_MINUTES', { $value: '3' }), value: 180000 },
    { label: translateRaw('TIME_MINUTES', { $value: '5' }), value: 300000 },
    { label: translateRaw('TIME_MINUTES', { $value: '10' }), value: 600000 },
    { label: translateRaw('TIME_MINUTES', { $value: '15' }), value: 900000 },
    { label: translateRaw('TIME_MINUTES', { $value: '30' }), value: 1800000 },
    { label: translateRaw('TIME_MINUTES', { $value: '45' }), value: 2700000 },
    { label: translateRaw('TIME_HOUR', { $value: '1' }), value: 3600000 },
    { label: translateRaw('TIME_HOURS', { $value: '3' }), value: 10800000 },
    { label: translateRaw('TIME_HOURS', { $value: '6' }), value: 21600000 },
    { label: translateRaw('TIME_HOURS', { $value: '12' }), value: 43200000 }
  ];

  const dispatch = useDispatch();
  const timeout = useSelector(getAutoLockTimeout);
  const value = options.find((o) => o.value === timeout);

  const handleChange = (option: OptionType<number>) => dispatch(setAutoLockTimeout(option.value));
  const handlePropagation = (e: MouseEvent) => e.stopPropagation();

  return (
    <SettingsAccordion icon={lockIcon} label={translateRaw('AUTO_LOCK_TIMER')}>
      <Body>{translateRaw('AUTO_LOCK_TIMER_BODY')}</Body>
      <Body mt="2">{translateRaw('AUTO_LOCK_TIMER_LABEL')}</Body>
      <Box mt="2" onClick={handlePropagation}>
        <TextSelector options={options} value={value} onChange={handleChange} />
      </Box>
    </SettingsAccordion>
  );
};
