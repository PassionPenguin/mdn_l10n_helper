import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router';
import ComparePage from './pages/compare';
import Toast from './components/toast/toast';
import { PreferencesProvider } from '@utils/preferences-context';
import Spinner from './components/spinner/spinner';
import PreferencesPage from '@pages/preferences';
import HomePage from '@pages/home';
import PRPage from '@pages/pr';

// Banner Context
export const BannerContext = React.createContext<{ message: any; setMessage: (msg: any) => void }>({
    message: null,
    setMessage: () => {},
});

function App() {
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
                        <HashRouter>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/compare" element={<ComparePage />} />
                                <Route path="/pr" element={<PRPage />} />
                                <Route path="/preferences" element={<PreferencesPage />} />
                            </Routes>
                        </HashRouter>
                    </Suspense>
                </BannerContext.Provider>
            </PreferencesProvider>
            <button className="fixed right-4 bottom-4 h-14 w-14 rounded-full bg-amber-400 p-4 font-bold text-white hover:bg-amber-500 dark:bg-amber-600 dark:text-black">
                <span className="material-symbols-rounded" onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? 'close' : 'menu'}
                </span>
            </button>
            <div
                className={
                    'fixed right-4 bottom-24 w-30 rounded bg-amber-100 p-4 font-bold text-black dark:bg-amber-800 dark:text-white ' +
                    (showMenu ? 'flex' : 'hidden')
                }
            >
                <ul className="space-y-2">
                    <li>
                        <a href="/mdn_l10n_helper/#preferences">Preferences</a>
                    </li>
                    <li>
                        <a href="/mdn_l10n_helper/#compare">Compare</a>
                    </li>
                    <li>
                        <a href="/mdn_l10n_helper/#pr">PR Files</a>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default App;
