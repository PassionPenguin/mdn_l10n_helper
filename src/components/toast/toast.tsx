import './styles.scss';

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
    let icon = type === "error" ? "error" : (type === "success" ? "check_circle" : "info");

    return (
        <div className={"toast toast-" + type}>
            <p>
                <span className="material-symbols-rounded">{icon}</span> <span>{message}</span>
            </p>
            <span className="material-symbols-rounded close" onClick={onClose}>close</span>
        </div>
    );
}
