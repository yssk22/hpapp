/**
 * provide internationalization functions.
 *
 * @module
 * @see https://yssk22.github.io/hpapp/expo/i18n.html
 */
import * as Localization from 'expo-localization';
import { I18n, TranslateOptions } from 'i18n-js';

type TranslationCotentOriginalFormat = {
  [key: string]: {
    [lang: string]: string;
  };
};

type TranslationContent = {
  [lang: string]: {
    [key: string]: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const original = require('@hpapp/assets/translations.json');

// convert original format to i18n-js format.
const convertTranslations = (src: TranslationCotentOriginalFormat): TranslationContent => {
  const content: TranslationContent = {
    en: {}
  };
  for (const key in src) {
    const trans = src[key];
    content['en'][key] = key;
    for (const lang in trans) {
      if (content[lang] === undefined) {
        content[lang] = {};
      }
      content[lang][key] = trans[lang];
    }
  }
  return content;
};

const i18n = new I18n(convertTranslations(original));
const locale = Localization.getLocales()[0].languageCode ?? 'ja';

i18n.locale = ['ja', 'en'].indexOf(locale) >= 0 ? locale : 'en';
i18n.enableFallback = true;

/**
 * translate a string. It's a wrapper of `i18n.t` in i18n-js.
 * @param msg English message
 * @param options
 * @returns translated message
 *
 * @see https://github.com/fnando/i18n
 */
const t = (msg: string, options?: TranslateOptions) => {
  return i18n.t(msg, options);
};

export { t };
