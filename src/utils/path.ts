/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

export function DecomposePath(path: string) {
    if (path.startsWith('files/')) path = path.slice(6);
    else return { status: false };
    if (path.endsWith('/index.md')) path = path.slice(0, -9);
    else return { status: false };
    return {
        status: true,
        data: {
            locale: path.split('/')[0],
            path: path.split('/').slice(1).join('/'),
        },
    };
}
