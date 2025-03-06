import React from "react";
import {usePreferences} from "@utils/preferences-context";

enum PreferenceInputType {
    TEXT = "text",
    CHECKBOX = "checkbox"
}

interface PreferenceItemProps {
    name: string;
    description: string;
    inputType: PreferenceInputType;
    value: any;
    onChange: (value: any) => void;
}

export default function PreferencesPage() {
    const {preferences, updatePreferences} = usePreferences();
    const mappedPreferences = [
        {
            name: "Access Token",
            description: "Access Token generated from GitHub for API access.",
            inputType: PreferenceInputType.TEXT,
            value: preferences.accessToken,
            onChange: (value: any) => updatePreferences({accessToken: value})
        }
    ];

    return (
        <main className="container mx-auto mt-4">
            <h1 className="text-4xl font-bold mb-8">Preferences</h1>
            <div className="my-4">
                <div className="font-medium mb-8">
                    <p>
                        These preferences will only be saved to your browser's local storage without encryption. Be
                        always sure to use the application only on device you trusted, otherwise leak of these
                        preferences or even account data may occur.

                        <br/>

                        Certain preferences may require a page refresh to take effect.

                        <br/>

                        By clearing browser cache or delete site's stored data, you will lose these preferences forever.
                    </p>
                </div>
                {
                    mappedPreferences.map((preference, index) => (
                        <PreferenceItem key={index} {...preference}/>
                    ))
                }
            </div>
        </main>
    );
}

function PreferenceItem(props: PreferenceItemProps) {
    return (
        <div className="flex justify-between mb-4">
            <div className="w-64 lg:w-96">
                <h2 className="text-lg font-bold">{props.name}</h2>
                <p className="text-sm font-medium">{props.description}</p>
            </div>
            <div className="border-amber-400 border p-2.5 rounded outline-none font-mono">
                <PreferenceInput type={props.inputType} value={props.value} onChange={props.onChange}/>
            </div>
        </div>
    )
}

function PreferenceInput({type, value, onChange}: {
    type: PreferenceInputType,
    value: any,
    onChange: (value: any) => void
}) {
    return (
        type === PreferenceInputType.CHECKBOX ?
            <input className="bg-transparent outline-none" type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}/> :
            <input className="bg-transparent outline-none" type="text" value={value} onChange={(e) => onChange(e.target.value)}/>
    )
}