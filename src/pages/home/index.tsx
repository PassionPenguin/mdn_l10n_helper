/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import { Link } from 'react-router';
import I18N from '@utils/i18n.base';

export default function HomePage() {
    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 text-4xl font-bold items-center space-x-2 flex">
                <span className="material-symbols-rounded text-4xl! text-theme-text-primary">home</span>
                <span>{I18N.homeTitle}</span>
            </h1>
            <div className="my-4">
                <h2 className="mb-2 text-2xl font-black">{I18N.homeHelperTitle}</h2>
                <p>{I18N.homeIntro}</p>
                <p>
                    {I18N.homeToken1}
                    <Link to="/preferences" className="mx-2 text-orange-700 dark:text-orange-300">
                        {I18N.homeTokenHere}
                    </Link>
                    {I18N.homeToken2}
                </p>
                <p>
                    {I18N.homeCompare1}
                    <Link to="/compare" className="mx-2 text-orange-700 dark:text-orange-300">
                        <code>/compare</code>
                    </Link>
                    {I18N.homeCompare2} <code>mdn/content</code>{I18N.homeCompare3}
                </p>
                <p>
                    {I18N.homePR1}
                    <Link to="/pr" className="mx-2 text-orange-700 dark:text-orange-300">
                        <code>/pr</code>
                    </Link>
                    {I18N.homePR2}
                </p>
                <p className="my-16 text-center text-sm">{I18N.homeCopyright}</p>
            </div>
        </main>
    );
}
