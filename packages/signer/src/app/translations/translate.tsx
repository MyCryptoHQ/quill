import { translateRaw } from '@quill/common';
import type { ReactElement } from 'react';

import { TranslateMarkdown } from '@components';

export type TranslatedText = ReactElement | string;

export function translate(
  key: string,
  variables?: { [name: string]: string }
): ReactElement<typeof TranslateMarkdown> {
  return <TranslateMarkdown source={translateRaw(key, variables)} />;
}

export default translate;
