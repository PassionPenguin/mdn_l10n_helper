import yaml from 'js-yaml';
import { Octokit } from '@octokit/core';
import { b64DecodeUnicode } from '@utils/utils';

class Entry {
    title: string;
    slug: string;
    // sourceCommit:
    //  - when the entry is a l10ned one, this refers to the commit hash of the source entry
    //  - when the entry is a source one, this refers to the commit hash of the entry itself
    sourceCommit: string | undefined;
    content: string;

    constructor(title: string, slug: string, sourceCommit: string, content: string) {
        this.title = title;
        this.slug = slug;
        this.sourceCommit = sourceCommit;
        this.content = content;
    }

    static async fromGitHub(
        owner: string,
        repo: string,
        branch: string,
        path: string,
        locale: string,
        accessToken: string | undefined
    ): Promise<Entry> {
        const octokit = new Octokit({
            auth: accessToken,
        });
        const endpoint = `GET /repos/${owner}/${repo}/contents/files/${locale}/${path}/index.md`;
        const response = await octokit.request(endpoint, {
            ref: branch,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28',
            },
        });

        if (response.status === 404) {
            throw new Error('Resource not found');
        } else if (response.status === 403) {
            throw new Error('Forbidden');
        }

        const text = b64DecodeUnicode(response.data.content);

        const match = text.match(/^---([\s\S]+?)---/);
        if (match) {
            let metaData: any = yaml.load(match[1]);
            if (!metaData.title || !metaData.slug) {
                throw new Error('Invalid metadata found in the file');
            }

            if (locale !== 'en-us') {
                return new Entry(
                    metaData.title,
                    metaData.slug,
                    metaData.l10n?.sourceCommit ?? 'no source commit yet',
                    text.replace(match[0], '').trim()
                );
            }
            const response = await octokit.request('GET /repos/{owner}/{repo}/commits', {
                owner: owner,
                repo: repo,
                path: `files/${locale}/${path}/index.md`,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });
            if (response.status === 200 && response.data.length > 0) {
                return new Entry(
                    metaData.title,
                    metaData.slug,
                    response.data[0].sha,
                    text.replace(match[0], '').trim()
                );
            } else {
                throw new Error('No commits found in the repository');
            }
        } else {
            throw new Error('No metadata found in the file');
        }
    }
}

export default Entry;
