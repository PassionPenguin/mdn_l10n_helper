import { useEffect, useState, useContext } from 'react';
import { usePreferences } from '@utils/preferences-context';
import { createBackendClient, ChangeEntry, DiffResponse } from '@utils/backend';
import DiffReview from '../compare/diff-review';
import { BannerContext } from '@/App';
import GoodInput from '@components/form/input.tsx';
import yaml from 'js-yaml';

export default function ReviewPage() {
    const { preferences } = usePreferences();
    const backend = createBackendClient(preferences.backendUrl);
    const { setMessage } = useContext(BannerContext);

    const [locale, setLocale] = useState('zh-cn');
    const [changes, setChanges] = useState<ChangeEntry[]>([]);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [loadingChanges, setLoadingChanges] = useState(false);
    const [loadingDiff, setLoadingDiff] = useState(false);
    const [l10nedEntry, setL10nedEntry] = useState<any>();
    const [sourceEntry, setSourceEntry] = useState<any>();
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
                    sourceCommit: metaData.l10n?.sourceCommit
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

    const loadDiff = async (path: string) => {
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
                sourceCommit: translationMetadata.sourceCommit || ''
            });
            setSourceEntry({
                content: trimYamlFrontMatter(diff.source.content),
                title: sourceMetadata.title || '',
                slug: sourceMetadata.slug || path,
                sourceCommit: (diff.source as any).source_commit || ''
            });
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoadingDiff(false);
    };

    useEffect(() => {
        loadChanges();
    }, [locale, preferences.backendUrl]);

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-4 flex items-center space-x-2 text-3xl font-bold">
                <span className="material-symbols-rounded text-theme-text-primary text-4xl!">rule</span>
                <span>Review Pending Changes</span>
            </h1>
            <div className="mb-2 flex items-center space-x-2">
                <div>
                    <div className="pb-1 text-sm font-medium text-theme-text-light">Locale</div>
                    <GoodInput name="locale" type="text" defaultValue={locale} onChange={(v) => setLocale(v || '')} />
                </div>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-5 rounded border px-2 py-1"
                    onClick={loadChanges}
                >
                    {loadingChanges ? 'Loading…' : 'Refresh'}
                </button>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-5 rounded border px-2 py-1"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? 'Hide List' : 'Show List'}
                </button>
                <div className="text-sm text-theme-text-muted mt-5">Backend: {backend.base}</div>
            </div>
            <div className="flex border rounded overflow-hidden h-[calc(100vh-220px)]">
                {sidebarOpen && (
                    <aside className="w-80 border-r overflow-y-auto bg-theme-content-bg">
                        <ul>
                            {changes.map((c) => (
                                <li
                                    key={c.path}
                                    className={`px-3 py-2 cursor-pointer flex justify-between items-center text-sm hover:bg-theme-hover ${selectedPath === c.path ? 'bg-theme-hover' : ''}`}
                                    onClick={() => loadDiff(c.path)}
                                >
                                    <span className="font-mono truncate max-w-[11rem]" title={c.path}>{c.path}</span>
                                    <span className="flex items-center space-x-1">
                                        <span title="source exists" className={`h-2 w-2 rounded-full ${c.source_exists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span title="translation exists" className={`h-2 w-2 rounded-full ${c.translation_exists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        <span className="text-xs rounded px-1 py-0.5 border bg-theme-content-bg">{c.status}</span>
                                    </span>
                                </li>
                            ))}
                            {changes.length === 0 && !loadingChanges && (
                                <li className="p-3 text-sm text-theme-text-muted">No changes.</li>
                            )}
                        </ul>
                    </aside>
                )}
                <section className="flex-1 overflow-y-auto p-4">
                    {!selectedPath && <div className="text-theme-text-muted">Select a file from the list to view diff.</div>}
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
                        <div className="mt-4 text-xs text-theme-text-muted">
                            <div>Source size: {sourceEntry.content.length} chars</div>
                            <div>Translation size: {l10nedEntry.content.length} chars</div>
                        </div>
                    )}
                    {loadingDiff && <div className="mt-4">Loading diff...</div>}
                </section>
            </div>
        </main>
    );
}
