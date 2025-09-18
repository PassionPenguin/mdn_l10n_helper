/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

export function getStorageItem(key: string) {
    return localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
    return localStorage.setItem(key, value);
}
