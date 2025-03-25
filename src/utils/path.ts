export function DecomposePath(path: string) {
    if (path.startsWith('files/')) path = path.slice(6);
    else return { status: false };
    if (path.endsWith('/index.md')) path = path.slice(0, -9);
    else return { status: false };
    return {
        status: true,
        data: {
            locale: path.split('/')[0],
            path: path.split('/').slice(1).join('/'),
        },
    };
}
