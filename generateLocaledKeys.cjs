/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

const fs = require('fs');
const path = require('path');

const dictionaryPath = path.join(__dirname, 'dictionary.json');
const outputPath = path.join(__dirname, 'src/utils/i18n.extended.ts');

function generateLocaledKeys(dictionary) {
    let zhCNKeys = Object.keys(dictionary['zh-CN']),
        enUSKeys = Object.keys(dictionary['en-US']);

    // Check if both dictionaries have the same keys
    if (zhCNKeys.length !== enUSKeys.length) {
        throw new Error('The number of keys in the dictionaries do not match.');
    } else {
        for (let i = 0; i < zhCNKeys.length; i++) {
            if (enUSKeys.includes(zhCNKeys[i]) === false) {
                throw new Error(`The keys do not match.`);
            }
        }
    }

    const fileContent = `// This file is auto-generated. Do not edit manually.
import { Locale } from './i18n.base';
export type LocaledKeys = ${zhCNKeys.map((k) => `'${k}'`).join('|')};
export const I18NDict = {
    'zh-CN': {
        ${Object.entries(dictionary['zh-CN'])
            .map(([k, v]) => `${k}: '${v.replaceAll("'", "\\'")}'`)
            .join(',\n        ')}
    },
    'en-US': {
        ${Object.entries(dictionary['en-US'])
            .map(([k, v]) => `${k}: '${v.replaceAll("'", "\\'")}'`)
            .join(',\n        ')}
    }
} as Record<Locale, Record<LocaledKeys, string>>;
`;

    fs.writeFileSync(outputPath, fileContent, 'utf8');
}

fs.readFile(dictionaryPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading dictionary file:', err);
        return;
    }
    const dictionary = JSON.parse(data);
    generateLocaledKeys(dictionary);
    console.log('i18n-extended.ts has been generated successfully.');
});
