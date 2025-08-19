/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *  *
 *  * Last Modified on Aug 19, 2025 by hoarfroster
 *
 */

const toastMappings = {
    error: {
        toastStyles: 'bg-theme-bg-error-light/10',
        iconStyles: 'text-theme-error',
        icon: 'error',
    },
    success: {
        toastStyles: 'bg-theme-bg-success-light',
        iconStyles: 'text-theme-success',
        icon: 'check_circle',
    },
    info: {
        toastStyles: 'bg-theme-blue-light',
        iconStyles: 'text-theme-info',
        icon: 'info',
    },
};

export default function Toast({
    type,
    message,
    onClose,
}: {
    type?: 'error' | 'success' | 'info';
    message?: string;
    onClose: () => void;
}) {
    if (!type || !message) {
        return <></>;
    }

    return (
        <div
            className={
                'toast- fixed top-4 left-1/2 z-50 flex -translate-x-1/2 rounded-xl bg-theme-card-bg px-3 pt-1.5 pb-1.5 font-bold shadow-lg' +
                toastMappings[type].toastStyles
            }
        >
            <p className="m-0 mr-3 flex h-9 flex-1 truncate leading-9">
                <span
                    className={
                        'material-symbols-rounded mr-4 h-5 w-5 rounded p-1.5 align-middle' +
                        toastMappings[type].iconStyles
                    }
                >
                    {toastMappings[type].icon}
                </span>
                <span>{message}</span>
            </p>
            <span
                className="material-symbols-rounded mr-4 box-content h-5 w-5 cursor-pointer rounded-full p-1.5 align-middle hover:text-theme-text"
                onClick={onClose}
            >
                close
            </span>
        </div>
    );
}
