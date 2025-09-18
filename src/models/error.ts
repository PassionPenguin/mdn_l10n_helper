/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

// Helper function to handle GitHub API errors with localized messages
import I18N from '@utils/i18n.base.ts';

export function handleGitHubError(error: any): never {
    if (error.status === 403) {
        // Check if it's a rate limit error
        if (error.response?.headers?.['x-ratelimit-remaining'] === '0') {
            throw new Error(I18N.msgGitHubRateLimit);
        }
        throw new Error(I18N.msgGitHubForbidden);
    } else if (error.status === 404) {
        throw new Error(I18N.msgGitHubNotFound);
    } else {
        throw new Error(I18N.msgGitHubUnknownError);
    }
}
