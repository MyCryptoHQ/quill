import { fallbackLanguage, repository } from '@quill/common';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

export const Trans = ({
  id,
  variables
}: {
  id: string;
  variables?: { [name: string]: () => string | ReactNode };
}) => {
  const settings = { language: 'en' };
  const language = settings.language || fallbackLanguage;
  let tString =
    (repository[language] && repository[language][id]) || repository[fallbackLanguage][id] || id;

  const uniqueId = ((counter) => () => `${++counter}`)(0);

  if (!variables) {
    return <>{tString}</>;
  } else {
    const keys = Object.keys(variables);

    const variablesComponents: ReactNode[] = [];

    /**
     * Replace all variables with tags. I.E. $variable1 with <T1>
     */
    keys.forEach((key, index) => {
      const tStringSplit = tString.split(new RegExp(`\\${key}`));
      if (tStringSplit.length) {
        tString = tStringSplit.join(`<T${index}/>`);
        const value = variables[keys[index]];
        variablesComponents.push(value);
      }
    });

    const nextTagMatch = new RegExp('<T\\d+/>');

    /**
     * Replaces all <T{id}> with actual components from variables, and creates a components list
     * @param rest Rest of string to parse
     * @param components Components array of parsed string
     */
    const resolveComponents = (rest: string, components: ReactNode[] = []): ReactNode[] => {
      if (rest.length === 0) {
        return components;
      }

      const nextMatch = rest.match(nextTagMatch);
      if (nextMatch && nextMatch.length) {
        const resolvedComponentIndex = nextMatch[0].replace('<T', '').replace('/>', '');
        const resolvedComponentIndexNumber = parseInt(resolvedComponentIndex, 10);

        const matchSplit = [
          rest.substring(0, nextMatch.index!),
          rest.substring(nextMatch.index! + 4 + resolvedComponentIndex.length)
        ];

        return resolveComponents(matchSplit[1], [
          ...components,
          <Fragment key={uniqueId()}>{matchSplit[0]}</Fragment>,
          <Fragment key={uniqueId()}>
            {typeof variablesComponents[resolvedComponentIndexNumber] === 'function'
              ? (variablesComponents[resolvedComponentIndexNumber] as () => unknown)()
              : variablesComponents[resolvedComponentIndexNumber]}
          </Fragment>
        ]);
      }

      return resolveComponents('', [...components, <Fragment key={uniqueId()}>{rest}</Fragment>]);
    };

    return <>{resolveComponents(tString)}</>;
  }
};
