import React from 'react';

import { default as TranslateMarkdown } from '@app/components/Core/TranslateMarkdown';

import { translateRaw } from './translateRaw';

export type TranslatedText = React.ReactElement | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): React.ReactElement<typeof TranslateMarkdown> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
