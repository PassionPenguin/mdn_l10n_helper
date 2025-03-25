import { useContext, useState } from 'react';
import { BannerContext } from '@/App';
import Spinner from '@components/spinner/spinner';
import { usePreferences } from '@utils/preferences-context';
import { Link, useSearchParams } from 'react-router';
import PullRequest from '@models/pr';

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
            setMessage({ message: 'PR ID is required', type: 'error' });
            return;
        }
        try {
            const pr = await PullRequest.fromGitHub(prID, preferences.accessToken);
            setPR(pr);
            setMessage({ message: 'PR fetched successfully', type: 'success' });
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoading(false);
    };

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 text-4xl font-bold">PR Files</h1>
            <div className="my-4 flex space-x-1">
                <div>
                    <div className="pb-1 font-medium text-gray-700 dark:text-gray-200">
                        PR ID{' '}
                        <small>
                            e.g. <code>9999</code>
                        </small>
                    </div>
                    <input
                        className="w-full rounded border-2 border-amber-400 bg-transparent px-4 py-1.5"
                        type="text"
                        value={prID}
                        onChange={(e) => setPRID(e.target.value)}
                    />
                </div>
            </div>
            <div className="my-4 flex space-x-1">
                <button
                    className="rounded border-2 border-amber-400 bg-transparent px-4 py-1.5 hover:bg-amber-100 dark:hover:bg-amber-900"
                    onClick={fetchPR}
                >
                    Fetch
                </button>
            </div>

            {pr && (
                <ul className="my-8 list-disc">
                    {pr.files.map((file) => (
                        <li key={file.path + file.locale}>
                            <code className="rounded bg-orange-100 px-2 py-1.5 dark:bg-orange-900">{file.status}</code>/
                            <code className="rounded bg-orange-50 px-2 py-1.5 font-black dark:bg-orange-950">
                                {file.locale}
                            </code>
                            :
                            <Link
                                className="pl-4 text-orange-700 dark:text-orange-300"
                                to={`/compare?owner=${pr.owner}&branch=${pr.branch}&locale=${file.locale}&path=${file.path}`}
                            >
                                {file.path}
                            </Link>
                            <span className="text-gray-700 dark:text-gray-300">/index.md</span>
                        </li>
                    ))}
                </ul>
            )}
            {loading && <Spinner />}
        </main>
    );
}
