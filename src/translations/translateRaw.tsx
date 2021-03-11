import en from './lang/en.json';

const fallbackLanguage = 'en';
const repository: {
  [language: string]: {
    [translationName: string]: string;
  };
} = {};

type LanguageCode =
  | 'en'
  | 'de'
  | 'el'
  | 'es'
  | 'fi'
  | 'fr'
  | 'ht'
  | 'hu'
  | 'id'
  | 'it'
  | 'ja'
  | 'nl'
  | 'no'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'ko'
  | 'tr'
  | 'vi'
  | 'zhcn'
  | 'zhtw';

interface ILanguageData {
  code: LanguageCode;
  data: {
    [translationName: string]: string;
  };
}

const languages: ILanguageData[] = [en as ILanguageData];

languages.forEach((l) => {
  repository[l.code] = l.data;
});

export function translateRaw(key: string, variables?: { [name: string]: string }): string {
  // @todo: Either find an appropriate way to share the users language setting without needing to update all our translateRaw calls.
  // In the mean time we default to english.
  const settings = { language: 'en' };
  const language = settings.language || fallbackLanguage;
  const translatedString =
    (repository[language] && repository[language][key]) || repository[fallbackLanguage][key] || key;

  /** @desc In RegExp, $foo is two "words", but __foo is only one "word."
   *  Replace all occurences of '$' with '__' in the entire string and each variable,
   *  then iterate over each variable, replacing the '__variable' in the
   *  translation key with the variable's value.
   */
  if (variables) {
    let str = translatedString.replace(/\$/g, '__');

    Object.keys(variables).forEach((variable) => {
      const singleWordVariable = variable.replace(/\$/g, '__');
      const re = new RegExp(`\\b${singleWordVariable}\\b`, 'g');

      str = str.replace(re, variables[variable]);
    });

    return str;
  }
  return translatedString;
}
