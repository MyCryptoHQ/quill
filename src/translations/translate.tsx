import { ReactElement } from 'react';

import { default as TranslateMarkdown } from '@app/components/Core/TranslateMarkdown';
import { translateRaw } from '@common/translate';

export type TranslatedText = ReactElement | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): ReactElement<typeof TranslateMarkdown> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
