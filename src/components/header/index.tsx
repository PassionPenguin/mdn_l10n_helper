/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import { useState } from 'react';
import I18N from '@utils/i18n.base';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-40 h-13 break-keep">
            <nav className="mx-auto flex items-center justify-between px-8 py-2.5" aria-label="Global">
                <div className="flex items-center lg:flex-1">
                    <div className="flex items-center">
                        <a href="#" className="text-theme-text-primary -m-1.5 flex items-center space-x-4 p-1.5">
                            <span className="font-bold">{I18N.appName}</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="[&>*]:hover:bg-theme-hover hidden pl-4 font-bold lg:mx-8 lg:flex lg:gap-x-4 [&>*]:rounded-lg [&>*]:px-2 [&>*]:py-1">
                        <a href="#pr">{I18N.prFiles}</a>
                        <a href="#compare">{I18N.compare}</a>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
                >
                    <span className="material-symbols-rounded text-xl">menu</span>
                </button>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50" onClick={closeMobileMenu}></div>

                        {/* Mobile Sidebar */}
                        <div className="bg-theme-card-bg absolute top-0 left-0 h-full w-80 max-w-[80vw] shadow-xl">
                            {/* Mobile Header */}
                            <div className="border-theme-border flex items-center justify-between border-b p-4">
                                <h2 className="text-theme-text text-lg font-semibold">{I18N.menu}</h2>
                                <button
                                    onClick={closeMobileMenu}
                                    className="text-theme-text-light hover:bg-hover flex items-center justify-center rounded-lg p-2"
                                >
                                    <span className="material-symbols-rounded text-xl">close</span>
                                </button>
                            </div>

                            {/* Mobile Navigation */}
                            <nav className="flex flex-col space-y-2 p-4">
                                <a
                                    href="#pr"
                                    onClick={closeMobileMenu}
                                    className="text-theme-text-light hover:bg-theme-hover flex items-center rounded-lg px-4 py-3 text-base font-medium"
                                >
                                    <span className="material-symbols-rounded mr-3 text-xl">description</span>
                                    {I18N.prFiles}
                                </a>
                                <a
                                    href="#compare"
                                    onClick={closeMobileMenu}
                                    className="text-theme-text-light hover:bg-theme-hover flex items-center rounded-lg px-4 py-3 text-base font-medium"
                                >
                                    <span className="material-symbols-rounded mr-3 text-xl">compare</span>
                                    {I18N.compare}
                                </a>
                            </nav>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
