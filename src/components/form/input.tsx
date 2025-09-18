/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

import { useState } from 'react';

export default function GoodInput({
    label,
    name,
    defaultValue,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    disabled = false,
    optional = false,
    className = '',
    ...props
}: {
    label?: string;
    name: string;
    defaultValue?: string | number | readonly string[] | undefined;
    onChange?: (value: string | undefined) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    optional?: boolean;
    className?: string;
    [_: string]: any;
}) {
    const [inputValue, setInputValue] = useState<string | number | readonly string[] | undefined>(defaultValue),
        [focusing, setFocusing] = useState(false);

    const handleTrashClick = () => {
        setInputValue(undefined);
        if (onChange) {
            onChange(undefined);
        }
    };

    return (
        <div>
            {label && (
                <label className="text-theme-text-light block text-sm font-bold" htmlFor={name}>
                    {label}
                </label>
            )}
            <div
                className={`border-theme-border bg-theme-content-bg mt-1 block rounded-md border outline-none sm:text-sm ${focusing ? 'border-primary-500 ring-primary-500 bg-theme-hover ring-[1.25px]' : ''}`}
            >
                <input
                    name={name}
                    className={`block w-full flex-1 bg-transparent px-2 py-1.5 text-[0.9rem] font-medium outline-none ${className ?? ''}`}
                    type={type}
                    value={inputValue ?? ''}
                    onChange={(ev) => {
                        setInputValue(ev.target.value);
                        if (onChange) {
                            onChange(ev.target.value);
                        }
                    }}
                    onFocus={() => setFocusing(true)}
                    onBlur={() => setFocusing(false)}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    {...props}
                />
                {optional && (
                    <span
                        className="material-symbols-rounded hover:bg-8 my-1 mr-2 block h-4 w-4 cursor-pointer rounded-full p-2 align-middle"
                        onClick={handleTrashClick}
                    >
                        trash
                    </span>
                )}
            </div>
        </div>
    );
}
