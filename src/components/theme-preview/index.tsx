/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import { ThemeColorScheme } from '@utils/theme';

interface ThemePreviewProps {
    theme: ThemeColorScheme;
    isSelected: boolean;
    onClick: () => void;
}

/**
 * ThemePreview component that shows a preview of a theme with sample UI elements
 */
export function ThemePreview({ theme, isSelected, onClick }: ThemePreviewProps) {
    return (
        <div
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                isSelected
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
            }`}
            onClick={onClick}
        >
            <div className="space-y-3">
                {/* Theme name */}
                <div className="text-theme-text text-center text-sm font-medium">{theme.name}</div>

                {/* Preview container */}
                <div
                    className="overflow-hidden rounded border"
                    style={{
                        backgroundColor: theme.colors.bg,
                        borderColor: theme.colors.border,
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-3 py-2"
                        style={{
                            backgroundColor: theme.colors.nav,
                            borderBottomColor: theme.colors['border-divider'],
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: theme.colors.avatar }}
                            ></div>
                            <div className="h-2 w-12 rounded" style={{ backgroundColor: theme.colors.text }}></div>
                        </div>
                        <div className="h-2 w-2 rounded" style={{ backgroundColor: theme.colors.icon }}></div>
                    </div>

                    {/* Content area */}
                    <div className="space-y-2 p-3">
                        {/* Content lines */}
                        <div className="h-2 w-full rounded" style={{ backgroundColor: theme.colors.text }}></div>
                        <div
                            className="h-2 w-3/4 rounded"
                            style={{ backgroundColor: theme.colors['text-light'] }}
                        ></div>

                        {/* Button */}
                        <div className="mt-3">
                            <div className="h-6 w-16 rounded" style={{ backgroundColor: theme.colors.button }}></div>
                        </div>

                        {/* Card */}
                        <div
                            className="mt-2 rounded border p-2"
                            style={{
                                backgroundColor: theme.colors['card-bg'],
                                borderColor: theme.colors.border,
                            }}
                        >
                            <div
                                className="h-1.5 w-full rounded"
                                style={{ backgroundColor: theme.colors['text-muted'] }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
