/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

import { FormEvent, useContext, useEffect, useMemo, useState } from 'react';
import { BannerContext } from '@/App';
import Spinner from '@components/spinner/spinner';
import { usePreferences } from '@utils/preferences-context';
import { Link, useSearchParams } from 'react-router';
import PullRequest, { PRSummary } from '@models/pr';
import GoodInput from '@components/form/input.tsx';
import GoodSelect from '@components/form/select.tsx';
import I18N from '@utils/i18n.base';

interface LabelData {
    name: string;
    color: string;
}

export default function PRPage() {
    const [searchParams] = useSearchParams();

    const [prID, setPRID] = useState<string | undefined>(searchParams.get('pr') ?? undefined),
        [pr, setPR] = useState<PullRequest | undefined>(),
        [loading, setLoading] = useState(false);

    const { setMessage } = useContext(BannerContext);
    const { preferences } = usePreferences();

    const [author, setAuthor] = useState<string>('');
    const [labelsText, setLabelsText] = useState<string>('');
    const [sort, setSort] = useState<'created' | 'updated'>('updated');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [listLoading, setListLoading] = useState(false);
    const [prList, setPrList] = useState<PRSummary[]>([]);

    // Labels data for select
    const [allLabels, setAllLabels] = useState<LabelData[]>([]);
    const [labelsLoading, setLabelsLoading] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState<string>('');

    useEffect(() => {
        // fetch labels on first render and whenever token changes
        (async () => {
            setLabelsLoading(true);
            try {
                const labels = await PullRequest.fetchLabels(preferences.accessToken);
                setAllLabels(labels);
            } catch (e: any) {
                setMessage({ message: e.message, type: 'error' });
            }
            setLabelsLoading(false);
        })();
    }, [preferences.accessToken, setMessage]);

    useEffect(() => {
        (async () => {
            if (prID && prID != '' && !isNaN(parseInt(prID))) {
                await fetchPR();
            }
        })();
    }, [prID]);

    const fetchPR = async () => {
        setLoading(true);
        if (!prID) {
            setMessage({ message: I18N.msgPRIdRequired, type: 'error' });
            setLoading(false);
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

    const effectiveLabels = useMemo(() => {
        if (selectedLabel) return [selectedLabel];
        if (labelsText.trim())
            return labelsText
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
        return undefined;
    }, [selectedLabel, labelsText]);

    const searchPRs = async () => {
        setListLoading(true);
        try {
            const list = await PullRequest.searchOpenPRs(preferences.accessToken, {
                author: author || undefined,
                labels: effectiveLabels,
                sort,
                order,
                page: 1,
                perPage: 50,
            });
            setPrList(list);
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setListLoading(false);
    };

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 flex items-center space-x-2 text-4xl font-bold">
                <span className="material-symbols-rounded text-theme-text-primary text-4xl!">description</span>
                <span>{I18N.prFiles}</span>
            </h1>

            <section className="my-4 space-y-3">
                <h2 className="text-2xl font-semibold">{I18N.searchOpenPRs}</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="text-theme-text-light pb-1 font-medium">{I18N.authorLabel}</div>
                        <GoodInput
                            name="pr-author"
                            type="text"
                            defaultValue={author}
                            onChange={(v) => setAuthor(v ?? '')}
                            key={`author-${author}`}
                        />
                    </div>
                    <div>
                        <div className="text-theme-text-light pb-1 font-medium">{I18N.labelsLabel}</div>
                        {labelsLoading ? (
                            <div className="text-theme-text-muted text-sm">{I18N.loadingLabels}</div>
                        ) : (
                            <GoodSelect
                                name="pr-labels-select"
                                options={[
                                    { value: '', label: I18N.anyLabel },
                                    ...allLabels.map((lb) => ({ value: lb.name, label: lb.name })),
                                ]}
                                value={selectedLabel}
                                onChange={(v) => setSelectedLabel(typeof v === 'string' ? v : '')}
                            />
                        )}
                        <div className="text-theme-text-muted mt-1 flex items-center gap-2 text-xs">
                            <span>{I18N.orCommaSeparated}</span>
                            <GoodInput
                                name="pr-labels"
                                type="text"
                                defaultValue={labelsText}
                                onChange={(v) => setLabelsText(v ?? '')}
                                key={`labels-${labelsText}`}
                            />
                            <button
                                className="rounded border px-1"
                                onClick={() => {
                                    setSelectedLabel('');
                                    setLabelsText('');
                                }}
                            >
                                {I18N.clearLabel}
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="text-theme-text-light pb-1 font-medium">{I18N.sortLabel}</div>
                        <GoodSelect
                            name="pr-sort"
                            options={[
                                { value: 'updated', label: I18N.updatedLabel },
                                { value: 'created', label: I18N.createdLabel },
                            ]}
                            value={sort}
                            onChange={(v) => setSort(typeof v === 'string' ? (v as 'created' | 'updated') : 'updated')}
                        />
                    </div>
                    <div>
                        <div className="text-theme-text-light pb-1 font-medium">{I18N.orderLabel}</div>
                        <GoodSelect
                            name="pr-order"
                            options={[
                                { value: 'desc', label: I18N.descLabel },
                                { value: 'asc', label: I18N.ascLabel },
                            ]}
                            value={order}
                            onChange={(v) => setOrder(typeof v === 'string' ? (v as 'asc' | 'desc') : 'desc')}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                        onClick={searchPRs}
                    >
                        {I18N.fetch}
                    </button>
                    <div className="text-theme-text-muted text-sm">
                        {I18N.showingPRs.replace('{count}', prList.length.toString())}
                    </div>
                </div>
                <div className="mt-2 divide-y rounded border">
                    {listLoading && (
                        <div className="p-3">
                            <Spinner />
                        </div>
                    )}
                    {!listLoading && prList.length === 0 && (
                        <div className="text-theme-text-muted p-3 text-sm">{I18N.noPRsFound}</div>
                    )}
                    {!listLoading &&
                        prList.map((p) => (
                            <div key={p.number} className="flex items-center justify-between p-3">
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">
                                        #{p.number} {p.title}
                                    </div>
                                    <div className="text-theme-text-muted text-xs">
                                        {I18N.byAuthor.replace('{author}', p.author)} ·{' '}
                                        {I18N.updatedAt.replace('{date}', new Date(p.updatedAt).toLocaleString())}
                                    </div>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {p.labels.map((lb) => {
                                            const labelData = allLabels.find((l) => l.name === lb);
                                            const bgColor = labelData?.color ? `#${labelData.color}` : '#6b7280';
                                            const textColor = getContrastColor(bgColor);
                                            return (
                                                <span
                                                    key={lb}
                                                    className="rounded px-1 py-0.5 text-xs"
                                                    style={{ backgroundColor: bgColor, color: textColor }}
                                                >
                                                    {lb}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link className="text-theme-text-primary underline" to={`/review?pr=${p.number}`}>
                                        {I18N.reviewLabel}
                                    </Link>
                                    <button
                                        className="border-theme-border bg-theme-content-bg hover:bg-theme-hover rounded-md border px-2 py-1 text-sm"
                                        onClick={() => {
                                            setPRID(String(p.number));
                                            document.querySelector('#fetch-pr-section')?.scrollIntoView();
                                        }}
                                    >
                                        {I18N.loadFilesLabel}
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </section>

            <section className="my-6" id="fetch-pr-section">
                <h2 className="text-2xl font-semibold">{I18N.fetchByPRId}</h2>
                <div className="my-4 flex space-x-1">
                    <div>
                        <div className="text-theme-text-light pb-1 font-medium">
                            {I18N.prId}{' '}
                            <small>
                                {I18N.eg}. <code>9999</code>
                            </small>
                        </div>
                        <form
                            className="flex space-x-2"
                            onSubmit={(ev: FormEvent<HTMLFormElement>) => {
                                const prId = (ev.target as HTMLFormElement).prId.value;
                                setPRID(prId);
                            }}
                        >
                            <GoodInput name="pr-id" value={prID} />
                            <button
                                className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                                type="submit"
                            >
                                {I18N.fetch}
                            </button>
                        </form>
                    </div>
                </div>

                {pr && (
                    <div className="my-8">
                        <h3 className="mb-2 text-lg font-semibold">{I18N.filesInPR.replace('{prId}', pr.prId)}</h3>
                        <div className="grid gap-2">
                            {pr.files.map((file) => (
                                <div
                                    key={file.path + file.locale}
                                    className="flex items-center justify-between rounded border p-3"
                                >
                                    <div className="flex items-center space-x-2">
                                        <code className="bg-theme-bg-primary rounded px-2 py-1 text-xs">
                                            {file.status}
                                        </code>
                                        <code className="bg-theme-bg-primary rounded px-2 py-1 text-xs font-black">
                                            {file.locale}
                                        </code>
                                        <span className="font-mono text-sm">{file.path}</span>
                                    </div>
                                    <Link
                                        className="text-theme-text-primary text-sm underline"
                                        to={`/review?pr=${pr.prId}&path=${encodeURIComponent(file.path)}&locale=${encodeURIComponent(file.locale)}`}
                                    >
                                        {I18N.reviewLabel}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {loading && <Spinner />}
            </section>
        </main>
    );
}

// Helper function to determine text color based on background
function getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#ffffff';
}
