import { Body, Box, Button, Heading } from '@mycrypto/ui';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { LinkApp } from '@components';

import { SettingsAccordion } from './SettingsAccordion';

export const SettingsConfirm = ({
  icon,
  label,
  heading,
  body,
  buttonText,
  cancelText,
  onConfirm
}: {
  icon: string;
  label: string | ReactElement;
  heading: string | ReactElement;
  body: string | ReactElement;
  buttonText: string | ReactElement;
  cancelText: string | ReactElement;
  onConfirm(): void;
}) => {
  const [isOpened, setOpened] = useState(false);
  const toggleOpen = () => setOpened(!isOpened);
  return (
    <SettingsAccordion icon={icon} label={label} isOpen={isOpened} onOpen={toggleOpen}>
      <Heading fontSize="3" textAlign="center">
        {heading}
      </Heading>
      <Body mb="3">{body}</Body>
      <Button onClick={onConfirm}>{buttonText}</Button>
      <Box width="100%" pt="3" pb="2" px="3" sx={{ textAlign: 'center' }}>
        <LinkApp href="#" onClick={toggleOpen}>
          {cancelText}
        </LinkApp>
      </Box>
    </SettingsAccordion>
  );
};
