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

export default function GoodSelect({
    label,
    name,
    options,
    defaultValue,
    value,
    onChange,
    required = false,
    disabled = false,
}: {
    label?: string;
    name: string;
    options: { value: string; label: string }[];
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}) {
    const [focusing, setFocusing] = useState(false);

    return (
        <div>
            <label className="text-theme-text-light block text-sm font-bold" htmlFor={name}>
                {label}
            </label>
            <div
                className={`border-theme-border bg-theme-content-bg mt-1 block rounded-md border outline-none sm:text-sm ${focusing ? 'border-primary-500 ring-primary-500 bg-theme-hover ring-[1.25px]' : ''}`}
            >
                <select
                    name={name}
                    defaultValue={defaultValue}
                    value={value}
                    onChange={(ev) => onChange && onChange(ev.target.value)}
                    required={required}
                    onFocus={() => setFocusing(true)}
                    onBlur={() => setFocusing(false)}
                    disabled={disabled}
                    className="block w-full flex-1 bg-transparent px-2 py-1.5 text-[0.9rem] font-medium outline-none"
                >
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-theme-content-bg-dark"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
