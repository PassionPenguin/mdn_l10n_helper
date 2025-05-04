import Entry from '@models/entry';

interface DiffReviewProps {
    l10nedEntry: Entry | null | undefined;
    sourceEntry: Entry | null | undefined;
    locale: string;
    splitMethod: 'double' | 'single';
    path: string | null;
    enableMarkdownProcessing: boolean;
    enableMarkdownBQProcessing: boolean;
}

export default function CompareContent({ l10nedEntry, sourceEntry, locale, splitMethod, path, enableMarkdownProcessing, enableMarkdownBQProcessing }: DiffReviewProps) {
    if (!l10nedEntry || !sourceEntry) {
        return <div>Entries are not available for comparison.</div>;
    }

    let splitter: string = splitMethod === 'single' ? '\n' : '\n\n';

    const processMarkdownList = (content: string) => {
        if (!enableMarkdownProcessing) {
            return content.split(splitter);
        }
        return content
            .split(splitter)
            .flatMap((block) => {
                if (enableMarkdownBQProcessing && block.replace(/^\s+/, '').startsWith('>')) {
                    return block
                        .split(/\n\s*>\s*\n/)
                        .flatMap((item, index, arr) => index < arr.length - 1 ? [item, '>'] : [item]);
                }
                return block
                    .split(/\n(?=\s*- )/)
                    .map((line) => line);
            });
    };

    const l10nedLines = processMarkdownList(l10nedEntry.content);
    const sourceLines = processMarkdownList(sourceEntry.content);
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
                    <SourceEntryProperties entry={sourceEntry} path={path} />
                </div>
            </section>
            <section>
                {Array.from({ length: maxLength }).flatMap((_, i) => {
                    const isMarkdownListItem = (line: string) => line.trim().startsWith('- ');
                    const isMarkdownBlockquote = (line: string) => line.trim().startsWith('>');

                    const currentIsMarkdown =
                        isMarkdownListItem(l10nedLines[i] || '') ||
                        isMarkdownListItem(sourceLines[i] || '') ||
                        isMarkdownBlockquote(l10nedLines[i] || '') ||
                        isMarkdownBlockquote(sourceLines[i] || '');

                    const nextIsMarkdown =
                        i + 1 < maxLength &&
                        (isMarkdownListItem(l10nedLines[i + 1] || '') ||
                            isMarkdownListItem(sourceLines[i + 1] || '') ||
                            isMarkdownBlockquote(l10nedLines[i + 1] || '') ||
                            isMarkdownBlockquote(sourceLines[i + 1] || ''));

                    return [
                        <div
                            key={i}
                            className={`flex rounded px-4 py-1 font-mono break-all whitespace-pre-wrap hover:bg-gray-200 dark:hover:bg-gray-700`}
                        >
                            <div className="mr-4 w-1/2">{l10nedLines[i] || <>&nbsp;</>}</div>
                            <div className="w-1/2">{sourceLines[i] || <>&nbsp;</>}</div>
                        </div>,
                        splitMethod === 'double' && i < maxLength - 1 && (!currentIsMarkdown || !nextIsMarkdown)
                            ? <div key={`spacer-${i}`} className="h-4" />
                            : null,
                    ];
                })}
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
                    <li />
                </ul>
            </div>
        );
    }
}

function SourceEntryProperties({ entry, path }: { entry: Entry | null | undefined; path: string | null }) {
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
                    <li>
                        <b>Link to File</b>:
                        <a href={`https://github.com/mdn/content/blob/main/files/en-us/${path}/index.md`}>
                            Click HERE!
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}
