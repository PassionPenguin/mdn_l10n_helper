/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import { useContext, useState } from 'react';
import { BannerContext } from '@/App';
import Spinner from '@components/spinner/spinner';
import { usePreferences } from '@utils/preferences-context';
import { Link, useSearchParams } from 'react-router';
import PullRequest from '@models/pr';
import GoodInput from '@components/form/input.tsx';
import I18N from '@utils/i18n.base';

export default function PRPage() {
    const [searchParams] = useSearchParams();

    const [prID, setPRID] = useState<string | undefined>(searchParams.get('pr') ?? undefined),
        [pr, setPR] = useState<PullRequest | undefined>(),
        [loading, setLoading] = useState(false);

    const { setMessage } = useContext(BannerContext);
    const { preferences } = usePreferences();

    const fetchPR = async () => {
        setLoading(true);
        if (!prID) {
            setMessage({ message: I18N.msgPRIdRequired, type: 'error' });
            return;
        }
        try {
            const pr = await PullRequest.fromGitHub(prID, preferences.accessToken);
            setPR(pr);
            setMessage({ message: I18N.msgPRFetchedSuccess, type: 'success' });
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoading(false);
    };

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 flex items-center space-x-2 text-4xl font-bold">
                <span className="material-symbols-rounded text-theme-text-primary text-4xl!">description</span>
                <span>{I18N.prFiles}</span>
            </h1>
            <div className="my-4 flex space-x-1">
                <div>
                    <div className="text-theme-text-light pb-1 font-medium">
                        {I18N.prId}{' '}
                        <small>
                            {I18N.eg}. <code>9999</code>
                        </small>
                    </div>
                    <div className="flex space-x-2">
                        <GoodInput name="pr-id" onChange={(v) => setPRID(v)} />
                        <button
                            className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                            onClick={fetchPR}
                        >
                            {I18N.fetch}
                        </button>
                    </div>
                </div>
            </div>

            {pr && (
                <ul className="my-8 list-disc">
                    {pr.files.map((file) => (
                        <li key={file.path + file.locale}>
                            <code className="bg-theme-bg-primary rounded px-2 py-1.5">{file.status}</code>/
                            <code className="bg-theme-bg-primary rounded px-2 py-1.5 font-black">{file.locale}</code>:
                            <Link
                                className="pl-4 text-theme-text-primary"
                                to={`/compare?owner=${pr.owner}&branch=${pr.branch}&locale=${file.locale}&path=${file.path}`}
                            >
                                {file.path}
                            </Link>
                            <span className="text-theme-text-light">/index.md</span>
                        </li>
                    ))}
                </ul>
            )}
            {loading && <Spinner />}
        </main>
    );
}
