const toastMappings = {
    error: {
        toastStyles: 'bg-red-50 dark:bg-red-950',
        iconStyles: 'text-red-700 dark:text-red-400',
        icon: 'error',
    },
    success: {
        toastStyles: 'bg-green-50 dark:bg-green-950',
        iconStyles: 'text-green-700 dark:text-green-400',
        icon: 'check_circle',
    },
    info: {
        toastStyles: 'bg-blue-50 dark:bg-blue-950',
        iconStyles: 'text-blue-700 dark:text-blue-400',
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
                'toast- fixed top-4 left-1/2 z-50 flex -translate-x-1/2 rounded-xl bg-gray-200 px-3 pt-1.5 pb-1.5 font-bold shadow-lg dark:bg-gray-800 ' +
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
                className="material-symbols-rounded mr-4 box-content h-5 w-5 cursor-pointer rounded-full p-1.5 align-middle hover:text-black dark:hover:text-white"
                onClick={onClose}
            >
                close
            </span>
        </div>
    );
}
