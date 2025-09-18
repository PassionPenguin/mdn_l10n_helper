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
import Entry from '@models/entry';
import DiffReview from './diff-review';
import { BannerContext } from '@/App';
import Spinner from '@components/spinner/spinner';
import { usePreferences } from '@utils/preferences-context';
import { useSearchParams } from 'react-router';
import GoodInput from '@components/form/input.tsx';
import I18N from '@utils/i18n.base';

export default function ComparePage() {
    const [searchParams] = useSearchParams();
    const path = searchParams.get('path'),
        locale = searchParams.get('locale'),
        owner = searchParams.get('owner'),
        branch = searchParams.get('branch');

    const [filePath, setFilePath] = useState<string | undefined>(path ?? undefined),
        [fileLocale, setFileLocale] = useState<string | undefined>(locale ?? undefined),
        [l10nOwner, setL10nOwner] = useState<string | undefined>(owner ?? undefined),
        [l10nBranch, setL10nBranch] = useState<string | undefined>(branch ?? undefined),
        [l10nedEntry, setL10nedEntry] = useState<Entry | null | undefined>(),
        [sourceEntry, setSourceEntry] = useState<Entry | null | undefined>(),
        [loading, setLoading] = useState(false),
        [splitMethod, setSplitMethod] = useState<'double' | 'single'>(
            localStorage.getItem('splitMode') !== null
                ? localStorage.getItem('splitMode') === 'true'
                    ? 'double'
                    : 'single'
                : 'double'
        ),
        [enableMarkdownProcessing, setEnableMarkdownProcessing] = useState(
            localStorage.getItem('mdListProcessOption') !== null
                ? localStorage.getItem('mdListProcessOption') === 'true'
                : true
        ),
        [settingsVisible, setSettingsVisible] = useState(false),
        [enableMarkdownBQProcessing, setEnableMarkdownBQProcessing] = useState(
            localStorage.getItem('mdBQProcessOption') !== null
                ? localStorage.getItem('mdBQProcessOption') === 'true'
                : true
        );

    const [tempSplitMethod, setTempSplitMethod] = useState<'double' | 'single'>(splitMethod);
    const [tempEnableMarkdownProcessing, setTempEnableMarkdownProcessing] = useState(enableMarkdownProcessing);
    const [tempEnableMarkdownBQProcessing, setTempEnableMarkdownBQProcessing] = useState(enableMarkdownBQProcessing);

    const openSettings = () => {
        setTempSplitMethod(splitMethod);
        setTempEnableMarkdownProcessing(enableMarkdownProcessing);
        setTempEnableMarkdownBQProcessing(enableMarkdownBQProcessing);
        setSettingsVisible(true);
    };

    const cancelSettings = () => {
        setTempSplitMethod(splitMethod);
        setTempEnableMarkdownProcessing(enableMarkdownProcessing);
        setTempEnableMarkdownBQProcessing(enableMarkdownBQProcessing);
        setSettingsVisible(false);
    };

    const { setMessage } = useContext(BannerContext);
    const { preferences } = usePreferences();

    const fetchEntries = async () => {
        setLoading(true);
        if (!filePath || !fileLocale || !l10nBranch || !l10nOwner) {
            setMessage({ message: I18N.msgPathLocaleRequired, type: 'error' });
            setLoading(false);
            return;
        }
        try {
            setL10nedEntry(
                await Entry.fromGitHub(
                    l10nOwner,
                    'translated-content',
                    l10nBranch,
                    filePath,
                    fileLocale,
                    preferences.accessToken
                )
            );
            setSourceEntry(
                await Entry.fromGitHub('mdn', 'content', 'main', filePath, 'en-us', preferences.accessToken)
            );
            setMessage({ message: I18N.msgEntriesFetched, type: 'success' });
        } catch (e: any) {
            setMessage({ message: e.message, type: 'error' });
        }
        setLoading(false);
    };

    const saveEntries = () => {
            if (!l10nedEntry || !sourceEntry) {
                setMessage({ message: I18N.msgNoEntriesToSave, type: 'info' });
                return;
            }
            try {
                localStorage.setItem(
                    'e_' + path,
                    JSON.stringify({
                        l10ned: l10nedEntry,
                        source: sourceEntry,
                    })
                );
                setMessage({ message: I18N.msgEntriesSavedToLocalStorage, type: 'success' });
            } catch (e: any) {
                setMessage({ message: e.message, type: 'error' });
                return;
            }
        },
        readEntries = () => {
            const data = localStorage.getItem('e_' + path);
            if (!data) {
                setMessage({ message: I18N.msgNoEntriesFoundInLocalStorage, type: 'error' });
                return;
            }
            try {
                const parsed = JSON.parse(data);
                setL10nedEntry(parsed.l10ned);
                setSourceEntry(parsed.source);
                setMessage({ message: I18N.msgEntriesReadFromLocalStorage, type: 'success' });
            } catch (e: any) {
                setMessage({ message: e.message, type: 'error' });
            }
        };

    return (
        <main className="container mx-auto mt-4">
            <h1 className="mb-8 text-4xl font-bold items-center space-x-2 flex">
                <span className="material-symbols-rounded text-4xl! text-theme-text-primary">compare</span>
                <span>{I18N.compare}</span>
            </h1>
            <div className="my-4 flex space-x-1">
                <div>
                    <div className="pb-1 font-medium text-theme-text-light">
                        {I18N.ownerLabel}{' '}
                        <small>
                            {I18N.eg}. <code>mdn</code>
                        </small>
                    </div>
                    <GoodInput name="owner" type="text" value={l10nOwner} onChange={(v) => setL10nOwner(v)} />
                </div>
                <div>
                    <div className="pb-1 font-medium text-theme-text-light">
                        {I18N.branchLabel}{' '}
                        <small>
                            {I18N.eg}. <code>main</code>
                        </small>
                    </div>
                    <GoodInput name="branch" type="text" value={l10nBranch} onChange={(v) => setL10nBranch(v)} />
                </div>
                <div className="flex-1">
                    <div className="pb-1 font-medium text-theme-text-light">
                        {I18N.pathLabel}{' '}
                        <small>
                            {I18N.eg}. <code>mozilla/add-ons</code>
                        </small>
                    </div>
                    <GoodInput name="path" type="text" value={filePath} onChange={(v) => setFilePath(v)} />
                </div>
                <div>
                    <div className="pb-1 font-medium text-theme-text-light">
                        {I18N.localeLabel}{' '}
                        <small>
                            {I18N.eg}. <code>en-us</code>
                        </small>
                    </div>
                    {/* Bind to fileLocale so manual edits are reflected and used */}
                    <GoodInput name="locale" type="text" value={fileLocale} onChange={(v) => setFileLocale(v)} />
                </div>
            </div>
            <div className="my-4 flex space-x-1">
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                    onClick={fetchEntries}
                >
                    {I18N.fetch}
                </button>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                    onClick={saveEntries}
                >
                    {I18N.saveChanges} <br />
                    <small>{I18N.toLocalStorage}</small>
                </button>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                    onClick={readEntries}
                >
                    {I18N.readChanges} <br />
                    <small>{I18N.fromLocalStorage}</small>
                </button>
                <button
                    className="border-theme-border bg-theme-content-bg hover:bg-theme-hover mt-1 block cursor-pointer rounded-md border px-2 outline-none sm:text-sm"
                    onClick={openSettings}
                >
                    {I18N.settings}
                </button>
            </div>

            {settingsVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 w-full h-full">
                    <div className="relative w-96 rounded-lg p-6 shadow-lg bg-theme-card-bg">
                        <h2 className="mb-4 text-2xl font-bold">{I18N.settingsTitle}</h2>
                        <div className="mb-4">
                            <label className="block font-medium text-theme-text-light">{I18N.splitMethod}</label>
                            <select
                                id="split-method-select"
                                className="border-theme-border bg-theme-content-bg text-theme-text w-full rounded border-2 px-4 py-1.5"
                                value={tempSplitMethod}
                                onChange={(e) => setTempSplitMethod(e.target.value as 'double' | 'single')}
                            >
                                <option value="double">{I18N.splitOptionDouble}</option>
                                <option value="single">{I18N.splitOptionSingle}</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={tempEnableMarkdownProcessing}
                                    onChange={(e) => setTempEnableMarkdownProcessing(e.target.checked)}
                                    className="mr-2"
                                />
                                <span>{I18N.enableMarkdownListProcessing}</span>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={tempEnableMarkdownBQProcessing}
                                    onChange={(e) => setTempEnableMarkdownBQProcessing(e.target.checked)}
                                    className="mr-2"
                                />
                                <span>{I18N.enableMarkdownBQProcessing}</span>
                            </label>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="border-theme-border bg-theme-content-bg text-theme-text w-full rounded border-2 px-4 py-1.5 hover:bg-theme-bg-error-light"
                                onClick={cancelSettings}
                            >
                                {I18N.cancel}
                            </button>
                            <button
                                className="border-theme-border bg-theme-content-bg text-theme-text w-full rounded border-2 px-4 py-1.5 hover:bg-theme-bg-success-light"
                                onClick={() => {
                                    setSplitMethod(tempSplitMethod);
                                    setEnableMarkdownProcessing(tempEnableMarkdownProcessing);
                                    setEnableMarkdownBQProcessing(tempEnableMarkdownBQProcessing);
                                    // persist settings
                                    localStorage.setItem('splitMode', (tempSplitMethod === 'double').toString());
                                    localStorage.setItem('mdListProcessOption', tempEnableMarkdownProcessing.toString());
                                    localStorage.setItem('mdBQProcessOption', tempEnableMarkdownBQProcessing.toString());
                                    setSettingsVisible(false);
                                }}
                            >
                                {I18N.save}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {l10nedEntry && sourceEntry && fileLocale && (
                <DiffReview
                    key={splitMethod}
                    l10nedEntry={l10nedEntry}
                    sourceEntry={sourceEntry}
                    locale={fileLocale}
                    splitMethod={splitMethod}
                    path={filePath ?? null}
                    enableMarkdownProcessing={enableMarkdownProcessing}
                    enableMarkdownBQProcessing={enableMarkdownBQProcessing}
                />
            )}

            {loading && <Spinner />}
        </main>
    );
}
