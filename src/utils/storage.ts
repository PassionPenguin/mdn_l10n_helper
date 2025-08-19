/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

export function getStorageItem(key: string) {
    return localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string) {
    return localStorage.setItem(key, value);
}
