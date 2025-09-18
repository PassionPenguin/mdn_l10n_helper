/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

import { useContext, useEffect, useState } from 'react';
import { usePreferences } from '@utils/preferences-context';
import { ChangeEntry, createBackendClient, DiffResponse } from '@utils/backend';
import DiffReview from '../compare/diff-review';
import { BannerContext } from '@/App';
import GoodInput from '@components/form/input.tsx';
import yaml from 'js-yaml';
import { useSearchParams } from 'react-router';
import PullRequest from '@models/pr';
import Entry from '@models/entry';
import I18N from '@utils/i18n.base';

export default function ReviewPage() {
    const { preferences } = usePreferences();
    const backend = createBackendClient(preferences.backendUrl);
    const { setMessage } = useContext(BannerContext);
    const [searchParams] = useSearchParams();

    const prParam = searchParams.get('pr');
    const pathParam = searchParams.get('path');
    const localeParam = searchParams.get('locale');

    // Auto-detect mode: if PR is provided, use GitHub mode
    const isGitHubMode = !!prParam;

    const [locale, setLocale] = useState(localeParam || 'zh-cn');
    const [changes, setChanges] = useState<ChangeEntry[]>([]);
    const [selectedPath, setSelectedPath] = useState<string | null>(pathParam || null);
    const [loadingChanges, setLoadingChanges] = useState(false);
    const [loadingDiff, setLoadingDiff] = useState(false);
    const [l10nedEntry, setL10nedEntry] = useState<any>();
    const [sourceEntry, setSourceEntry] = useState<any>();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // PR mode states
    const [prId, setPrId] = useState<string | undefined>(prParam || undefined);
    const [prFiles, setPrFiles] = useState<Array<{ path: string; locale: string; status: string }>>([]);
    const [loadingPR, setLoadingPR] = useState(false);

    // Keep PR owner/branch
    const [prOwner, setPrOwner] = useState<string | undefined>(undefined);
    const [prBranch, setPrBranch] = useState<string | undefined>(undefined);

    // Function to trim YAML front matter from content
    const trimYamlFrontMatter = (content: string): string => {
        const match = content.match(/^---([\s\S]+?)---/);
        if (match) {
            return content.replace(match[0], '').trim();
        }
        return content;
    };

    // Function to parse YAML metadata from content
    const parseYamlMetadata = (content: string): { title?: string; slug?: string; sourceCommit?: string } => {
        const match = content.match(/^---([\s\S]+?)---/);
        if (match) {
            try {
                const metaData: any = yaml.load(match[1]);
                return {
                    title: metaData.title,
                    slug: metaData.slug,
                    sourceCommit: metaData.l10n?.sourceCommit,
                };
            } catch (e) {
                console.error('Failed to parse YAML metadata:', e);
            }
        }
        return {};
    };

    const loadChanges = async () => {
        setLoadingChanges(true);
        try {
            const list = await backend.fetchChanges(locale);
            setChanges(list);
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoadingChanges(false);
    };

    const loadDiffLocal = async (path: string) => {
        setSelectedPath(path);
        setLoadingDiff(true);
        try {
            const diff: DiffResponse = await backend.fetchDiff(locale, path);

            // Parse metadata from source content
            const sourceMetadata = parseYamlMetadata(diff.source.content);

            // Parse metadata from translation content
            const translationMetadata = parseYamlMetadata(diff.translation.content);

            setL10nedEntry({
                content: trimYamlFrontMatter(diff.translation.content),
                title: translationMetadata.title || '',
                slug: translationMetadata.slug || path,
                sourceCommit: translationMetadata.sourceCommit || '',
            });
            setSourceEntry({
                content: trimYamlFrontMatter(diff.source.content),
                title: sourceMetadata.title || '',
                slug: sourceMetadata.slug || path,
                sourceCommit: (diff.source as any).source_commit || '',
            });
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoadingDiff(false);
    };

    const loadPR = async () => {
        if (!prId) return;
        setLoadingPR(true);
        try {
            const pr = await PullRequest.fromGitHub(prId, preferences.accessToken);
            setPrFiles(pr.files);
            setPrOwner(pr.owner);
            setPrBranch(pr.branch);
            if (!locale && pr.files.length > 0) setLocale(pr.files[0].locale);
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoadingPR(false);
    };

    const loadDiffGitHub = async (path: string, loc: string) => {
        setSelectedPath(path);
        setLoadingDiff(true);

        let l10nEntry: Entry | null = null;
        let sourceEntryResult: Entry | null = null;
        let errors: string[] = [];

        try {
            // Try to fetch localized entry
            try {
                l10nEntry = await Entry.fromGitHub(
                    prOwner!,
                    'translated-content',
                    prBranch!,
                    path,
                    loc,
                    preferences.accessToken
                );
            } catch (e: any) {
                errors.push(`Localized file not found: ${e.message}`);
                // Create empty entry for missing localized file
                l10nEntry = new Entry('File not existed', '', path, '', '');
            }

            // Try to fetch source entry
            try {
                sourceEntryResult = await Entry.fromGitHub(
                    'mdn',
                    'content',
                    'main',
                    path,
                    'en-us',
                    preferences.accessToken
                );
            } catch (e: any) {
                errors.push(`Source file not found: ${e.message}`);
                // Create empty entry for missing source file
                sourceEntryResult = new Entry('File not existed', '', path, '', '');
            }

            setL10nedEntry(l10nEntry);
            setSourceEntry(sourceEntryResult);

            if (errors.length > 0) {
                setMessage({
                    message: `Some files not found: ${errors.join(', ')}`,
                    type: 'error',
                });
            }
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoadingDiff(false);
    };

    // Load initial data depending on mode
    useEffect(() => {
        if (isGitHubMode) {
            if (prId) {
                (async () => {
                    setLoadingPR(true);
                    try {
                        const pr = await PullRequest.fromGitHub(prId, preferences.accessToken);
                        setPrFiles(pr.files);
                        setPrOwner(pr.owner);
                        setPrBranch(pr.branch);
                        if (!locale && pr.files.length > 0) setLocale(pr.files[0].locale);

                        // Auto-load diff if path and locale are provided
                        if (pathParam && localeParam) {
                            setTimeout(() => {
                                loadDiffGitHub(pathParam, localeParam);
                            }, 100);
                        }
                    } catch (e: any) {
                        setMessage({ message: e.message, type: 'error' });
                    }
                    setLoadingPR(false);
                })();
            }
        } else {
            // Local mode: load list for current locale
            setSelectedPath(null);
            setL10nedEntry(undefined);
            setSourceEntry(undefined);
            (async () => {
                await loadChanges();
            })();
        }
    }, [prId, locale, preferences.backendUrl, isGitHubMode]);

    const filteredPRFiles = prFiles.filter((f) => !locale || f.locale.toLowerCase() === locale.toLowerCase());

    const handleSelectPath = async (path: string) => {
        if (isGitHubMode) {
            await loadDiffGitHub(path, locale);
        } else {
            await loadDiffLocal(path);
        }
    };

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-4 flex items-center space-x-2 text-3xl font-bold">
                <span className="material-symbols-rounded text-theme-text-primary text-4xl!">rule</span>
                <span>{I18N.reviewPendingChanges}</span>
            </h1>
            <div className="mb-2 flex flex-wrap items-end gap-3">
                <div>
                    <div className="text-theme-text-light pb-1 text-sm font-medium">{I18N.localeLabel2}</div>
                    <GoodInput
                        name="locale"
                        type="text"
                        defaultValue={locale}
                        onChange={(v) => setLocale(v || '')}
                        key={`locale-${locale}`}
                    />
                </div>
                {isGitHubMode && (
                    <div>
                        <div className="text-theme-text-light pb-1 text-sm font-medium">{I18N.prIdLabel}</div>
                        <GoodInput
                            name="pr-id"
                            type="text"
                            defaultValue={prId}
                            onChange={(v) => setPrId(v || undefined)}
                            key={`pr-${prId ?? ''}`}
                        />
                    </div>
                )}
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-5 rounded border px-2 py-1"
                    onClick={async () => {
                        if (isGitHubMode) {
                            await loadPR();
                        } else {
                            await loadChanges();
                        }
                    }}
                >
                    {loadingChanges || loadingPR ? 'Loading…' : I18N.refreshLabel}
                </button>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-5 rounded border px-2 py-1"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? I18N.hideListLabel : I18N.showListLabel}
                </button>
                <div className="text-theme-text-muted mt-5 text-sm">
                    {I18N.modeLabel}: {isGitHubMode ? I18N.githubPRMode : I18N.localBackendMode}
                    {!isGitHubMode ? ` · ${I18N.backendLabel}: ${backend.base}` : ''}
                </div>
            </div>
            <div className="flex h-[calc(100vh-220px)] overflow-hidden rounded border">
                {sidebarOpen && (
                    <aside className="bg-theme-content-bg w-80 overflow-y-auto border-r">
                        {!isGitHubMode ? (
                            <ul>
                                {changes.map((c) => (
                                    <li
                                        key={c.path}
                                        className={`hover:bg-theme-hover flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${selectedPath === c.path ? 'bg-theme-hover' : ''}`}
                                        onClick={() => handleSelectPath(c.path)}
                                    >
                                        <span className="max-w-[11rem] truncate font-mono" title={c.path}>
                                            {c.path}
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <span
                                                title={I18N.sourceExists}
                                                className={`h-2 w-2 rounded-full ${c.source_exists ? 'bg-green-500' : 'bg-red-500'}`}
                                            ></span>
                                            <span
                                                title={I18N.translationExists}
                                                className={`h-2 w-2 rounded-full ${c.translation_exists ? 'bg-green-500' : 'bg-red-500'}`}
                                            ></span>
                                            <span className="bg-theme-content-bg rounded border px-1 py-0.5 text-xs">
                                                {c.status}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                                {changes.length === 0 && !loadingChanges && (
                                    <li className="text-theme-text-muted p-3 text-sm">{I18N.noChangesLabel}</li>
                                )}
                            </ul>
                        ) : (
                            <ul>
                                {filteredPRFiles.map((f) => (
                                    <li
                                        key={f.locale + f.path}
                                        className={`hover:bg-theme-hover flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${selectedPath === f.path ? 'bg-theme-hover' : ''}`}
                                        onClick={() => handleSelectPath(f.path)}
                                    >
                                        <span className="max-w-[11rem] truncate font-mono" title={f.path}>
                                            {f.path}
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <span className="bg-theme-content-bg rounded border px-1 py-0.5 text-xs">
                                                {f.status}
                                            </span>
                                            <span className="bg-theme-content-bg rounded border px-1 py-0.5 text-xs">
                                                {f.locale}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                                {filteredPRFiles.length === 0 && !loadingPR && (
                                    <li className="text-theme-text-muted p-3 text-sm">{I18N.noFilesForLocale}</li>
                                )}
                            </ul>
                        )}
                    </aside>
                )}
                <section className="flex-1 overflow-y-auto p-4">
                    {!selectedPath && <div className="text-theme-text-muted">{I18N.selectFileToViewDiff}</div>}
                    {selectedPath && l10nedEntry && sourceEntry && (
                        <DiffReview
                            l10nedEntry={l10nedEntry}
                            sourceEntry={sourceEntry}
                            locale={locale}
                            splitMethod={'double'}
                            path={selectedPath}
                            enableMarkdownProcessing={true}
                            enableMarkdownBQProcessing={true}
                        />
                    )}
                    {selectedPath && !loadingDiff && l10nedEntry && sourceEntry && (
                        <div className="text-theme-text-muted mt-4 text-xs">
                            <div>{I18N.sourceSize.replace('{size}', sourceEntry.content.length.toString())}</div>
                            <div>{I18N.translationSize.replace('{size}', l10nedEntry.content.length.toString())}</div>
                        </div>
                    )}
                    {loadingDiff && <div className="mt-4">{I18N.loadingDiff}</div>}
                </section>
            </div>
        </main>
    );
}
