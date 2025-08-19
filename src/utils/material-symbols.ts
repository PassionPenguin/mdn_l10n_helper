/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

const SYMBOLS = ['compare', 'description'];

export default function useSymbols() {
    const symbols = SYMBOLS.sort((a, b) => a.localeCompare(b)).join(',');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded&icon_names=${symbols}&display=block`;
    document.head.appendChild(link);
}
