import React, {Suspense, useEffect, useState} from 'react';
import {HashRouter, Route, Routes} from "react-router-dom";
import ComparePage from "./pages/compare";
import Toast from "./components/toast/toast";
import {PreferencesProvider} from "@utils/preferences-context";
import Spinner from "./components/spinner/spinner";
import PreferencesPage from "@pages/preferences";
import HomePage from "@pages/home";

// Banner Context
export const BannerContext = React.createContext<{ message: any; setMessage: (msg: any) => void }>({
    message: null,
    setMessage: () => {
    },
});

function App() {
    const [bannerMessage, setBannerMessage] = useState<{
            message: string,
            type: 'error' | 'success' | 'info'
        } | null>(null),
        [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        setTimeout(() => setBannerMessage(null), 6000);
    }, [bannerMessage]);

    return (
        <>
            <PreferencesProvider>
                <Toast key={bannerMessage?.message} type={bannerMessage?.type}
                       message={bannerMessage?.message}
                       onClose={() => setBannerMessage(null)}/>
                <BannerContext.Provider value={{message: bannerMessage, setMessage: setBannerMessage}}>
                    <Suspense fallback={<Spinner/>}>
                        <HashRouter>
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/compare" element={<ComparePage/>}/>
                                <Route path="/preferences" element={<PreferencesPage/>}/>
                            </Routes>
                        </HashRouter>
                    </Suspense>
                </BannerContext.Provider>
            </PreferencesProvider>
            <button
                className="fixed bottom-4 right-4 w-14 h-14 p-4 rounded-full font-bold bg-amber-400 dark:bg-amber-600 hover:bg-amber-500 text-white dark:text-black">
                <span className="material-symbols-rounded"
                      onClick={() => setShowMenu(!showMenu)}>
                    {showMenu ? "close" : "menu"}
                </span>
            </button>
            <div
                className={"fixed bottom-24 right-4 w-30 p-4 rounded bg-amber-100 dark:bg-amber-800 font-bold text-black dark:text-white " + (showMenu ? "flex" : "hidden")}>
                <ul className="space-y-2">
                    <li><a href="/mdn_l10n_helper/#preferences">Preferences</a></li>
                    <li><a href="/mdn_l10n_helper/#compare">Compare</a></li>
                </ul>
            </div>
        </>
    );
}

export default App;
