/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

const SYMBOLS = ['compare', 'description', 'check_circle', 'close', 'error', 'info', 'menu', 'home', 'settings', 'rule'];

export default function useSymbols() {
    const symbols = SYMBOLS.sort((a, b) => a.localeCompare(b)).join(',');

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded&icon_names=${symbols}&display=block`;
    document.head.appendChild(link);
}
