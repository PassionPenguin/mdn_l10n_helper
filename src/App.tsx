/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import ComparePage from './pages/compare';
import Toast from './components/toast/toast';
import { PreferencesProvider } from '@utils/preferences-context';
import Spinner from './components/spinner/spinner';
import PreferencesPage from '@pages/preferences';
import HomePage from '@pages/home';
import PRPage from '@pages/pr';
import useSymbols from '@utils/material-symbols.ts';
import Header from '@components/header';
import I18N from '@utils/i18n.base';

// Banner Context
export const BannerContext = React.createContext<{ message: any; setMessage: (msg: any) => void }>({
    message: null,
    setMessage: () => {},
});

function App() {
    useSymbols();

    const [bannerMessage, setBannerMessage] = useState<{
            message: string;
            type: 'error' | 'success' | 'info';
        } | null>(null),
        [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        setTimeout(() => setBannerMessage(null), 6000);
    }, [bannerMessage]);

    return (
        <>
            <PreferencesProvider>
                <Toast
                    key={bannerMessage?.message}
                    type={bannerMessage?.type}
                    message={bannerMessage?.message}
                    onClose={() => setBannerMessage(null)}
                />
                <BannerContext.Provider value={{ message: bannerMessage, setMessage: setBannerMessage }}>
                    <Suspense fallback={<Spinner />}>
                        <div className="h-max min-h-full w-full flex-1 m-0 bg-(image:--theme-bg-image) bg-cover bg-center bg-no-repeat">
                            <Header />
                            <div className="text-theme-text flex h-[calc(100vh-52px)] overflow-y-scroll flex-col">
                                <HashRouter>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/compare" element={<ComparePage />} />
                                        <Route path="/pr" element={<PRPage />} />
                                        <Route path="/preferences" element={<PreferencesPage />} />
                                    </Routes>
                                </HashRouter>
                            </div>
                        </div>
                    </Suspense>
                </BannerContext.Provider>
            </PreferencesProvider>
            <button className="bg-theme-bg-primary text-theme-text fixed right-4 bottom-4 h-14 w-14 cursor-pointer rounded-full p-4 font-bold">
                <span className="material-symbols-rounded" onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? 'close' : 'menu'}
                </span>
            </button>
            <div
                className={
                    'bg-theme-card-bg fixed right-4 bottom-24 cursor-pointer rounded-lg font-bold shadow duration-100 ' +
                    (showMenu ? 'flex' : 'hidden')
                }
            >
                <ul className="my-2">
                    <li className="text-theme-text-light! hover:text-theme-text! hover:bg-theme-hover px-4 py-2 duration-75">
                        <a href="/mdn_l10n_helper/#preferences">{I18N.preferences}</a>
                    </li>
                    <li className="text-theme-text-light! hover:text-theme-text! hover:bg-theme-hover px-4 py-2 duration-75">
                        <a href="/mdn_l10n_helper/#compare">{I18N.compare}</a>
                    </li>
                    <li className="text-theme-text-light! hover:text-theme-text! hover:bg-theme-hover px-4 py-2 duration-75">
                        <a href="/mdn_l10n_helper/#pr">{I18N.prFiles}</a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default App;
