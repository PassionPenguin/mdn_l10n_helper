import Entry from '@models/entry';

export default function CompareContent({
    l10nedEntry,
    sourceEntry,
    locale,
}: {
    l10nedEntry: Entry | null | undefined;
    sourceEntry: Entry | null | undefined;
    locale: string;
}) {
    if (!l10nedEntry || !sourceEntry) {
        return <div>Entries are not available for comparison.</div>;
    }

    const l10nedLines = l10nedEntry.content.split('\n');
    const sourceLines = sourceEntry.content.split('\n');
    const maxLength = Math.max(l10nedLines.length, sourceLines.length);

    return (
        <>
            <section className="flex flex-row break-all">
                <div className="w-1/2">
                    <h2 className="text-2xl font-bold">
                        Localized <span>{locale}</span>
                    </h2>
                    <L10nedEntryProperties entry={l10nedEntry} />
                </div>
                <div className="w-1/2">
                    <h2 className="text-2xl font-bold">Source</h2>
                    <SourceEntryProperties entry={sourceEntry} />
                </div>
            </section>
            <section>
                {Array.from({ length: maxLength }).map((_, i) => (
                    <div className="flex rounded px-4 py-1 font-mono break-all whitespace-pre-wrap hover:bg-gray-200 dark:hover:bg-gray-700">
                        <div className="mr-4 w-1/2">{l10nedLines[i] || <>&nbsp;</>}</div>
                        <div className="w-1/2">{sourceLines[i] || <>&nbsp;</>}</div>
                    </div>
                ))}
            </section>
        </>
    );
}

function L10nedEntryProperties({ entry }: { entry: Entry | null | undefined }) {
    if (entry === undefined) {
        return null;
    } else if (entry === null) {
        return <div>Entry not localized yet</div>;
    } else {
        return (
            <div>
                <h3 className="text-xl font-bold">Metadata</h3>
                <ul>
                    <li>
                        <b>Title</b>: <code>{entry?.title}</code>
                    </li>
                    <li>
                        <b>Slug</b>: <code>{entry?.slug}</code>
                    </li>
                    <li>
                        <b>Source Commit</b>: <code>{entry?.sourceCommit}</code>
                    </li>
                </ul>
            </div>
        );
    }
}

function SourceEntryProperties({ entry }: { entry: Entry | null | undefined }) {
    if (entry === undefined) {
        return null;
    } else if (entry === null) {
        return <div>Entry not localized yet</div>;
    } else {
        return (
            <div>
                <h3 className="text-xl font-bold">Metadata</h3>
                <ul>
                    <li>
                        <b>Title</b>: <code>{entry?.title}</code>
                    </li>
                    <li>
                        <b>Slug</b>: <code>{entry?.slug}</code>
                    </li>
                    <li>
                        <b>Current Commit</b>: <code>{entry?.sourceCommit}</code>
                    </li>
                </ul>
            </div>
        );
    }
}
