/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

import { getStorageItem, setStorageItem } from '@utils/storage';
import { I18NDict, LocaledKeys } from '@utils/i18n.extended';

export type Locale = 'en-US' | 'zh-CN';
export const I18NLocales = ['en-US', 'zh-CN'],
    I18NLocaleNames = ['English', '简体中文'];

let currentLocale: Locale = (() => {
    const stored = getStorageItem('locale');
    if (stored && stored in I18NLocales) {
        return stored as Locale;
    } else {
        if (stored) {
            if (stored.startsWith('en')) {
                return 'en-US';
            } else if (stored.startsWith('zh')) {
                return 'zh-CN';
            }
        }
        setStorageItem('locale', 'zh-CN');
        return 'zh-CN';
    }
})();

type I18NType = {
    [K in LocaledKeys]: string;
} & {
    currentLocale: Locale;
    setLocale: (locale: Locale) => void;
};

const i18nHandler = {
    get(_: any, prop: string | symbol) {
        if (prop === 'currentLocale') return currentLocale;
        if (prop === 'setLocale') return setLocale;

        if (typeof prop === 'string' && prop in I18NDict[currentLocale]) {
            return I18NDict[currentLocale][prop as LocaledKeys];
        }
        return undefined;
    },
};

function setLocale(locale: Locale) {
    currentLocale = locale;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('locale', locale);
    }
}

export default new Proxy<I18NType>({} as I18NType, i18nHandler);
