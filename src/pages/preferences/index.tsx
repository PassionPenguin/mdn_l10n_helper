/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import { usePreferences } from '@utils/preferences-context';
import { useEffect, useState } from 'react';
import { applyTheme, getCurrentTheme, getThemeColors, setAutoMode, ThemeMode } from '@utils/theme.ts';
import GoodSelect from '@components/form/select.tsx';
import GoodInput from '@components/form/input.tsx';
import { ThemePreview } from '@components/theme-preview';
import { v7 as uuidv7 } from 'uuid';
import I18N from '@utils/i18n.base';

enum PreferenceInputType {
    TEXT = 'text',
    CHECKBOX = 'checkbox',
    SELECT = 'select',
}

interface PreferenceItemProps {
    name: string;
    description: string;
    inputType: PreferenceInputType;
    value: any;
    onChange: (value: any) => void;
    options?: { value: string; label: string }[];
}

export default function PreferencesPage() {
    const { preferences, updatePreferences } = usePreferences();

    // Theme-related state
    const [autoMode, setAutoModeState] = useState(() => {
        const currentTheme = getCurrentTheme();
        return currentTheme.autoMode;
    });

    const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
        const currentTheme = getCurrentTheme();
        return currentTheme.mode;
    });

    const [backgroundEnabled, setBackgroundEnabled] = useState(() => {
        const currentTheme = getCurrentTheme();
        return currentTheme.backgroundEnabled;
    });

    // Auto mode effect
    useEffect(() => {
        if (!autoMode) return;
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e: MediaQueryListEvent) => {
            const newMode = e.matches ? 'dark' : 'light';
            setThemeMode(newMode);
            applyTheme(newMode, backgroundEnabled);
        };
        setThemeMode(mq.matches ? 'dark' : 'light');
        applyTheme(mq.matches ? 'dark' : 'light', backgroundEnabled);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [autoMode, backgroundEnabled]);

    // Apply theme when settings change
    useEffect(() => {
        setAutoMode(autoMode);
        applyTheme(themeMode, backgroundEnabled);
    }, [autoMode, themeMode, backgroundEnabled]);

    const mappedPreferences = [
        {
            name: I18N.accessTokenLabel,
            description: I18N.accessTokenDesc,
            inputType: PreferenceInputType.TEXT,
            value: preferences.accessToken,
            onChange: (value: any) => updatePreferences({ accessToken: value }),
        },
        {
            name: I18N.languageLabel,
            description: I18N.languageDesc,
            inputType: PreferenceInputType.SELECT,
            value: I18N.currentLocale,
            onChange: (value: any) => {
                I18N.setLocale(value);
                window.location.reload();
            },
            options: [
                { value: 'en-US', label: 'English (US)' },
                { value: 'zh-CN', label: 'Simplified Chinese' },
            ],
        },
    ];

    return (
        <main className="container mx-auto mt-4 px-8">
            <h1 className="mb-8 text-4xl font-bold items-center space-x-2 flex">
                <span className="material-symbols-rounded text-4xl! text-theme-text-primary">settings</span>
                <span>{I18N.preferences}</span>
            </h1>
            <div className="my-4">
                <div className="mb-8 font-medium">
                    <p>
                        {I18N.prefWarning1}
                        <br />
                        {I18N.prefWarning2}
                        <br />
                        {I18N.prefWarning3}
                    </p>
                </div>

                {/* Theme Settings Section */}
                <div className="bg-theme-content-bg mb-8 rounded-lg p-6 shadow">
                    <h2 className="text-theme-text mb-4 text-xl font-bold">{I18N.themeSettings}</h2>

                    {/* Auto Mode Toggle */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-theme-text text-lg font-semibold">{I18N.followSystemTheme}</h3>
                            <p className="text-theme-text-muted text-sm">{I18N.followSystemThemeDesc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={autoMode}
                                onChange={(e) => setAutoModeState(e.target.checked)}
                            />
                            <div className="peer bg-theme-content-bg-dark h-6 w-11 rounded-full transition-colors peer-checked:bg-blue-500 peer-checked:dark:bg-blue-600"></div>
                            <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
                        </label>
                    </div>

                    {/* Background Toggle */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-theme-text text-lg font-semibold">{I18N.backgroundImage}</h3>
                            <p className="text-theme-text-muted text-sm">{I18N.backgroundImageDesc}</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={backgroundEnabled}
                                onChange={(e) => setBackgroundEnabled(e.target.checked)}
                            />
                            <div className="peer bg-theme-content-bg-dark h-6 w-11 rounded-full transition-colors peer-checked:bg-blue-500 peer-checked:dark:bg-blue-600"></div>
                            <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
                        </label>
                    </div>

                    {/* Theme Selection */}
                    {!autoMode && (
                        <div className="mb-6">
                            <h3 className="text-theme-text mb-3 text-lg font-semibold">{I18N.theme}</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {(['light', 'dark'] as ThemeMode[]).map((mode) => (
                                    <ThemePreview
                                        key={mode}
                                        theme={getThemeColors(mode)}
                                        isSelected={themeMode === mode}
                                        onClick={() => {
                                            setThemeMode(mode);
                                            applyTheme(mode, backgroundEnabled);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {mappedPreferences.map((preference, index) => (
                    <PreferenceItem key={index} {...preference} />
                ))}
            </div>
        </main>
    );
}

function PreferenceItem(props: PreferenceItemProps) {
    return (
        <div className="bg-theme-content-bg flex justify-between rounded-lg p-4 shadow">
            <div className="w-64 lg:w-96">
                <h2 className="text-theme-text text-lg font-bold">{props.name}</h2>
                <p className="text-theme-text-muted text-sm font-medium">{props.description}</p>
            </div>
            <div>
                <PreferenceInput
                    type={props.inputType}
                    value={props.value}
                    onChange={props.onChange}
                    options={props.options}
                />
            </div>
        </div>
    );
}

function PreferenceInput({
    type,
    value,
    onChange,
    options,
}: {
    type: PreferenceInputType;
    value: any;
    onChange: (value: any) => void;
    options?: { value: string; label: string }[];
}) {
    if (type === PreferenceInputType.CHECKBOX) {
        return (
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="peer bg-theme-content-bg-dark h-6 w-11 rounded-full transition-colors peer-checked:bg-blue-500 peer-checked:dark:bg-blue-600"></div>
                <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
            </label>
        );
    }

    if (type === PreferenceInputType.SELECT && options) {
        return <GoodSelect name={uuidv7()} options={options} value={value} onChange={(v) => onChange(v)} />;
    }

    return <GoodInput name={uuidv7()} defaultValue={value} onChange={(v) => onChange(v)} type="text" />;
}
