import React from 'react';

import { TranslateMarkdown } from '@app/components';

import { translateRaw } from './translateRaw';

export type TranslatedText = React.ReactElement | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): React.ReactElement<typeof TranslateMarkdown> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
