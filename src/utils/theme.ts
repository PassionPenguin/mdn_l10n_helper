/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

import { getStorageItem, setStorageItem } from '@utils/storage.ts';

/**
 * Available theme modes
 * - 'light': Light theme with bright backgrounds and dark text
 * - 'dark': Dark theme with dark backgrounds and light text
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Theme color scheme configuration
 * Defines the color palette for different UI elements
 */
export interface ThemeColorScheme {
    /** Human-readable name for the theme */
    name: string;
    /** Color definitions for various UI elements */
    colors: {
        /** Primary background color */
        'bg-primary': string;
        bg: string;
        'content-bg-light': string;
        'content-bg': string;
        'content-bg-dark': string;
        /** Navigation bar background color */
        nav: string;
        /** Primary text color */
        'text-primary': string;
        text: string;
        'text-light': string;
        'text-muted': string;
        /** Active/selected state color */
        active: string;
        /** Sidebar background color */
        sidebar: string;
        /** Accent line color */
        line: string;
        /** Avatar placeholder color */
        avatar: string;
        /** Input field background color */
        input: string;
        /** Input field border color */
        'input-border': string;
        /** Button background color */
        button: string;
        /** Button hover background color */
        'button-hover': string;
        /** Secondary button background */
        'button-secondary': string;
        /** Secondary button hover background */
        'button-secondary-hover': string;
        /** Border color for general use */
        border: string;
        /** Border color for dividers */
        'border-divider': string;
        /** Success color */
        success: string;
        /** Warning color */
        warning: string;
        /** Error color */
        error: string;
        /** Info color */
        info: string;
        /** Hover background for interactive elements */
        hover: string;
        /** Card background */
        'card-bg': string;
        /** Popup/modal background */
        'popup-bg': string;
        /** Icon color */
        icon: string;
        /** Link color */
        link: string;
        /** Focus ring color */
        focus: string;
        /** Disabled text color */
        'text-disabled': string;
        /** Badge background colors */
        'badge-blue': string;
        'badge-green': string;
        'badge-yellow': string;
        'badge-red': string;
        'badge-purple': string;
        /** Special background colors */
        'bg-blue-light': string;
        'bg-success-light': string;
        'bg-warning-light': string;
        'bg-error-light': string;
    };
}

/**
 * Complete theme configuration object
 */
export interface ThemeConfig {
    /** Current theme mode (light/dark) */
    mode: ThemeMode;
    /** Whether auto mode (system preference) is enabled */
    autoMode: boolean;
    /** Whether background image is enabled */
    backgroundEnabled: boolean;
}

// ============================================================================
// THEME COLOR CONFIGURATIONS
// ============================================================================

/**
 * Comprehensive theme color configurations
 * Uses the design system colors defined in index.css for consistency
 */
export const themeColorSchemes: Record<ThemeMode, ThemeColorScheme> = {
    light: {
        name: 'Light Theme',
        colors: {
            'bg-primary': '#b3e0ff',
            bg: 'rgb(248 250 252)', // Tailwind slate-50
            'content-bg-light': 'rgb(248 250 252)',
            'content-bg': '#fff',
            'content-bg-dark': 'rgb(243 241 241)',
            nav: 'rgb(255 255 255)', // Pure white
            'text-primary': '#2486ac',
            text: 'rgb(30 41 59)', // Tailwind slate-800
            'text-light': 'rgb(75 85 99)', // Tailwind gray-600
            'text-muted': 'rgb(107 114 128)', // Tailwind gray-500
            active: 'rgb(59 130 246)', // Tailwind blue-500
            sidebar: 'rgb(248 250 252)', // Tailwind slate-50
            line: 'rgb(125 211 252)', // Tailwind sky-300
            avatar: 'rgb(203 213 225)', // Tailwind slate-300
            input: 'rgb(255 255 255)', // Pure white
            'input-border': 'rgb(229 231 235)', // Tailwind gray-200
            button: 'rgb(100 116 139)', // Tailwind slate-500
            'button-hover': 'rgb(71 85 105)', // Tailwind slate-600
            'button-secondary': 'rgb(243 244 246)', // Tailwind gray-100
            'button-secondary-hover': 'rgb(229 231 235)', // Tailwind gray-200
            border: 'rgb(229 231 235)', // Tailwind gray-200
            'border-divider': 'rgb(229 231 235)', // Tailwind gray-200
            success: 'rgb(34 197 94)', // Tailwind green-500
            warning: 'rgb(234 179 8)', // Tailwind yellow-500
            error: 'rgb(239 68 68)', // Tailwind red-500
            info: 'rgb(59 130 246)', // Tailwind blue-500
            hover: 'rgb(249 250 251)', // Tailwind gray-50
            'card-bg': 'rgb(255 255 255)', // Pure white
            'popup-bg': 'rgb(255 255 255)', // Pure white
            icon: 'rgb(107 114 128)', // Tailwind gray-500
            link: 'rgb(59 130 246)', // Tailwind blue-500
            focus: 'rgb(59 130 246)', // Tailwind blue-500
            'text-disabled': 'rgb(156 163 175)', // Tailwind gray-400
            'badge-blue': 'rgb(59 130 246)', // Tailwind blue-500
            'badge-green': 'rgb(34 197 94)', // Tailwind green-500
            'badge-yellow': 'rgb(234 179 8)', // Tailwind yellow-500
            'badge-red': 'rgb(239 68 68)', // Tailwind red-500
            'badge-purple': 'rgb(168 85 247)', // Tailwind purple-500
            'bg-blue-light': 'rgb(239 246 255)', // Tailwind blue-50
            'bg-success-light': 'rgb(240 253 244)', // Tailwind green-50
            'bg-warning-light': 'rgb(254 252 232)', // Tailwind yellow-50
            'bg-error-light': 'rgb(254 242 242)', // Tailwind red-50
        },
    },
    dark: {
        name: 'Dark Theme',
        colors: {
            'bg-primary': '#072b44',
            bg: 'rgb(30 41 59)', // Tailwind slate-800
            'content-bg-light': 'rgb(11 18 34)',
            'content-bg': 'rgb(15 23 42)', // Tailwind slate-900
            'content-bg-dark': 'rgb(30 41 59)',
            nav: 'rgb(15 23 42)', // Tailwind slate-900
            'text-primary': '#4da2ff',
            text: 'rgb(241 245 249)', // Tailwind slate-100
            'text-light': 'rgb(203 213 225)', // Tailwind slate-300
            'text-muted': 'rgb(148 163 184)', // Tailwind slate-400
            active: 'rgb(96 165 250)', // Tailwind blue-400
            sidebar: 'rgb(15 23 42)', // Tailwind slate-900
            line: 'rgb(56 189 248)', // Tailwind sky-400
            avatar: 'rgb(51 65 85)', // Tailwind slate-700
            input: 'rgb(51 65 85)', // Tailwind slate-700
            'input-border': 'rgb(71 85 105)', // Tailwind slate-600
            button: 'rgb(14 165 233)', // Tailwind sky-500
            'button-hover': 'rgb(2 132 199)', // Tailwind sky-600
            'button-secondary': 'rgb(51 65 85)', // Tailwind slate-700
            'button-secondary-hover': 'rgb(71 85 105)', // Tailwind slate-600
            border: 'rgb(71 85 105)', // Tailwind slate-600
            'border-divider': 'rgb(94 108 124)', // Tailwind slate-600
            success: 'rgb(34 197 94)', // Tailwind green-500
            warning: 'rgb(234 179 8)', // Tailwind yellow-500
            error: 'rgb(248 113 113)', // Tailwind red-400
            info: 'rgb(96 165 250)', // Tailwind blue-400
            hover: 'rgb(51 65 85)', // Tailwind slate-700
            'card-bg': 'rgb(51 65 85)', // Tailwind slate-700
            'popup-bg': 'rgb(51 65 85)', // Tailwind slate-700
            icon: 'rgb(148 163 184)', // Tailwind slate-400
            link: 'rgb(96 165 250)', // Tailwind blue-400
            focus: 'rgb(96 165 250)', // Tailwind blue-400
            'text-disabled': 'rgb(100 116 139)', // Tailwind slate-500
            'badge-blue': 'rgb(96 165 250)', // Tailwind blue-400
            'badge-green': 'rgb(34 197 94)', // Tailwind green-500
            'badge-yellow': 'rgb(234 179 8)', // Tailwind yellow-500
            'badge-red': 'rgb(248 113 113)', // Tailwind red-400
            'badge-purple': 'rgb(196 181 253)', // Tailwind purple-300
            'bg-blue-light': 'rgb(30 58 138)', // Tailwind blue-800
            'bg-success-light': 'rgb(22 101 52)', // Tailwind green-800
            'bg-warning-light': 'rgb(133 77 14)', // Tailwind yellow-800
            'bg-error-light': 'rgb(153 27 27)', // Tailwind red-800
        },
    },
};

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * localStorage keys for theme persistence
 */
const STORAGE_KEYS = {
    MODE: 'theme-mode',
    AUTO: 'theme-auto',
    BACKGROUND: 'theme-background',
} as const;

// ============================================================================
// CORE THEME FUNCTIONS
// ============================================================================

/**
 * Initializes the theme system on application startup
 *
 * This function:
 * 1. Reads saved theme preferences from localStorage
 * 2. Detects system color scheme preference if auto mode is enabled
 * 3. Applies the determined theme immediately
 * 4. Sets up system preference change listeners
 *
 * @returns {ThemeConfig} The current theme configuration
 *
 * @example
 * ```typescript
 * // Initialize theme system on app startup
 * const themeConfig = initializeTheme();
 * console.log(`Current theme: ${themeConfig.mode}`);
 * ```
 */
export function initializeTheme(): ThemeConfig {
    const autoMode = getStorageItem(STORAGE_KEYS.AUTO) === 'true';
    const storedMode = getStorageItem(STORAGE_KEYS.MODE) as ThemeMode;
    const backgroundEnabled = getStorageItem(STORAGE_KEYS.BACKGROUND) !== 'false';

    // Determine current theme mode
    let currentMode: ThemeMode;
    if (autoMode) {
        currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        currentMode = storedMode || 'light';
    }

    // Apply theme immediately
    applyTheme(currentMode, backgroundEnabled);

    // Set up system preference listener
    setupSystemThemeListener();

    return {
        mode: currentMode,
        autoMode,
        backgroundEnabled,
    };
}

/**
 * Applies a theme mode to the application
 *
 * This function:
 * 1. Updates CSS custom properties for TailwindCSS integration
 * 2. Updates body classes for theme-specific styling
 * 3. Applies background image if enabled
 * 4. Persists settings to localStorage
 *
 * @param {ThemeMode} mode - The theme mode to apply
 * @param {boolean} [backgroundEnabled=true] - Whether to show background image
 *
 * @example
 * ```typescript
 * // Switch to dark theme with background
 * applyTheme('dark', true);
 *
 * // Switch to light theme without background
 * applyTheme('light', false);
 * ```
 */
export function applyTheme(mode: ThemeMode, backgroundEnabled: boolean = true): void {
    const scheme = themeColorSchemes[mode];
    const root = document.documentElement;
    const body = document.body;

    // Update CSS custom properties for TailwindCSS
    Object.entries(scheme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-theme-${key}`, value);
    });

    // Update body classes
    body.classList.remove('light', 'dark');
    body.classList.add(mode);

    // Apply background image
    applyBackgroundImage(backgroundEnabled);

    // Update preview root if it exists (for component previews)
    const previewRoot = document.querySelector('.preview-root');
    if (previewRoot) {
        previewRoot.classList.remove('light', 'dark');
        previewRoot.classList.add(mode);
    }

    // Persist settings
    setStorageItem(STORAGE_KEYS.MODE, mode);
    setStorageItem(STORAGE_KEYS.BACKGROUND, backgroundEnabled.toString());
}

/**
 * Toggles between light and dark theme modes
 *
 * @param {boolean} [backgroundEnabled] - Optional background setting override
 * @returns {ThemeMode} The new theme mode after toggling
 *
 * @example
 * ```typescript
 * // Simple toggle
 * const newMode = toggleTheme();
 *
 * // Toggle with background disabled
 * const newMode = toggleTheme(false);
 * ```
 */
export function toggleTheme(backgroundEnabled?: boolean): ThemeMode {
    const currentConfig = getCurrentTheme();
    const newMode = currentConfig.mode === 'light' ? 'dark' : 'light';
    const bgEnabled = backgroundEnabled ?? currentConfig.backgroundEnabled;

    applyTheme(newMode, bgEnabled);
    return newMode;
}

/**
 * Enables or disables automatic theme switching based on system preference
 *
 * @param {boolean} enabled - Whether to enable auto mode
 *
 * @example
 * ```typescript
 * // Enable auto theme switching
 * setAutoMode(true);
 *
 * // Disable auto theme switching
 * setAutoMode(false);
 * ```
 */
export function setAutoMode(enabled: boolean): void {
    setStorageItem(STORAGE_KEYS.AUTO, enabled.toString());

    if (enabled) {
        const systemMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentConfig = getCurrentTheme();
        applyTheme(systemMode, currentConfig.backgroundEnabled);
    }
}

/**
 * Toggles the background image on/off
 *
 * @param {boolean} [enabled] - Optional explicit enable/disable, toggles if not provided
 * @returns {boolean} The new background enabled state
 *
 * @example
 * ```typescript
 * // Toggle background
 * const isEnabled = toggleBackground();
 *
 * // Explicitly enable background
 * toggleBackground(true);
 * ```
 */
export function toggleBackground(enabled?: boolean): boolean {
    const currentConfig = getCurrentTheme();
    const newEnabled = enabled ?? !currentConfig.backgroundEnabled;

    applyBackgroundImage(newEnabled);
    setStorageItem(STORAGE_KEYS.BACKGROUND, newEnabled.toString());

    return newEnabled;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Applies or removes the background image
 *
 * @param {boolean} enabled - Whether to show the background image
 * @private
 */
function applyBackgroundImage(enabled: boolean): void {
    const root = document.documentElement;
    const currentTheme = getCurrentTheme();

    if (enabled) {
        const backgroundImage =
            currentTheme.mode === 'dark' ? 'url(/mdn_l10n_helper/website-background-dark.svg)' : 'url(/mdn_l10n_helper/website-background.svg)';

        root.style.setProperty('--theme-bg-image', backgroundImage);
        root.style.setProperty('--theme-bg-size', 'cover');
        root.style.setProperty('--theme-bg-position', 'center');
        root.style.setProperty('--theme-bg-repeat', 'no-repeat');
        root.style.setProperty('--theme-bg-attachment', 'fixed');
    } else {
        root.style.setProperty('--theme-bg-image', 'none');
        root.style.setProperty('--theme-bg-size', 'cover');
        root.style.setProperty('--theme-bg-position', 'center');
        root.style.setProperty('--theme-bg-repeat', 'no-repeat');
        root.style.setProperty('--theme-bg-attachment', 'fixed');
    }
}

/**
 * Sets up a listener for system color scheme changes
 * Only applies changes if auto mode is enabled
 *
 * @returns {Function} Cleanup function to remove the listener
 * @private
 */
function setupSystemThemeListener(): () => void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
        const autoMode = getStorageItem(STORAGE_KEYS.AUTO) === 'true';
        if (autoMode) {
            const newMode = mediaQuery.matches ? 'dark' : 'light';
            const currentConfig = getCurrentTheme();
            applyTheme(newMode, currentConfig.backgroundEnabled);
        }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
}

/**
 * Gets the current theme configuration
 *
 * @returns {ThemeConfig} Current theme configuration
 *
 * @example
 * ```typescript
 * const config = getCurrentTheme();
 * console.log(`Mode: ${config.mode}, Auto: ${config.autoMode}`);
 * ```
 */
export function getCurrentTheme(): ThemeConfig {
    const autoMode = getStorageItem(STORAGE_KEYS.AUTO) === 'true';
    const storedMode = getStorageItem(STORAGE_KEYS.MODE) as ThemeMode;
    const backgroundEnabled = getStorageItem(STORAGE_KEYS.BACKGROUND) !== 'false';

    let currentMode: ThemeMode;
    if (autoMode) {
        currentMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        currentMode = storedMode || 'light';
    }

    return {
        mode: currentMode,
        autoMode,
        backgroundEnabled,
    };
}

/**
 * Gets the color scheme for a specific theme mode
 *
 * @param {ThemeMode} mode - The theme mode
 * @returns {ThemeColorScheme} The color scheme configuration
 *
 * @example
 * ```typescript
 * const lightColors = getThemeColors('light');
 * console.log(lightColors.colors.bg); // Light theme background color
 * ```
 */
export function getThemeColors(mode: ThemeMode): ThemeColorScheme {
    return themeColorSchemes[mode];
}
