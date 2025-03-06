import React, {createContext, useState, useEffect, ReactNode} from 'react';

// Define the type for your preferences
interface Preferences {
    accessToken?: string;
}

// Define the type for the context value
interface PreferencesContextType {
    preferences: Preferences;
    updatePreferences: (newPreferences: Partial<Preferences>) => void;
}

// Create the context
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Define a default preference set
const defaultPreferences: Preferences = {
    accessToken: undefined,
};

// Provider component
export const PreferencesProvider = ({children}: { children: ReactNode }) => {
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

    // Load preferences from local storage when the component mounts
    useEffect(() => {
        const savedPreferences = localStorage.getItem('user-preferences');
        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    // Update preferences and save them to local storage
    const updatePreferences = (newPreferences: Partial<Preferences>) => {
        const updatedPreferences = {...preferences, ...newPreferences};
        setPreferences(updatedPreferences);
        localStorage.setItem('user-preferences', JSON.stringify(updatedPreferences));
    };

    return (
        <PreferencesContext.Provider value={{preferences, updatePreferences}}>
            {children}
        </PreferencesContext.Provider>
    );
};

// Custom hook to use preferences context
export const usePreferences = () => {
    const context = React.useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
};