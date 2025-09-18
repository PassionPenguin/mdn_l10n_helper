/*
 *
 *  * Copyright (c) [mdn_l10n_helper] 2025. All Rights Reserved.
 *  *
 *  * Last Modified on Sep 18, 2025 by hoarfroster
 *  *
 *  * Open sourced under GNU General Public License 3.0.
 *
 */

import { Octokit } from '@octokit/core';
import { DecomposePath } from '@utils/path';
import I18N from '@utils/i18n.base';
import { handleGitHubError } from '@models/error.ts';

export interface PRSummary {
    number: number;
    title: string;
    author: string;
    labels: string[];
    createdAt: string;
    updatedAt: string;
}

class PullRequest {
    title: string;
    prId: string;
    owner: string;
    branch: string;
    files: { path: string; locale: string; status: string }[];

    constructor(
        title: string,
        prId: string,
        owner: string,
        branch: string,
        files: {
            path: string;
            locale: string;
            status: string;
        }[]
    ) {
        this.title = title;
        this.prId = prId;
        this.owner = owner;
        this.branch = branch;
        this.files = files;
    }

    static async fromGitHub(prId: string, accessToken: string | undefined): Promise<PullRequest> {
        const octokit = new Octokit({
            auth: accessToken,
        });

        try {
            const prDetailsEndpoint = `GET /repos/mdn/translated-content/pulls/${prId}`,
                prDetailsResponse = await octokit.request(prDetailsEndpoint, {
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                });

            const prDetailsJSON = await prDetailsResponse.data,
                title = prDetailsJSON.title,
                owner = prDetailsJSON.head.repo.owner.login,
                branch = prDetailsJSON.head.ref;

            const prFilesEndpoint = `GET /repos/mdn/translated-content/pulls/${prId}/files`,
                prFilesResponse = await octokit.request(prFilesEndpoint, {
                    per_page: 3000,
                    headers: {
                        'X-GitHub-Api-Version': '2022-11-28',
                    },
                });

            const files = prFilesResponse.data
                .map((item: any) => {
                    const data = DecomposePath(item.filename);
                    if (data.status)
                        return {
                            status: item.status,
                            locale: data.data!.locale,
                            path: data.data!.path,
                        };
                    else return null;
                })
                .filter((item: any) => item !== null);

            return new PullRequest(title, prId, owner, branch, files);
        } catch (error: any) {
            handleGitHubError(error);
        }
    }

    static async searchOpenPRs(
        accessToken: string | undefined,
        {
            author,
            labels,
            sort = 'updated',
            order = 'desc',
            page = 1,
            perPage = 30,
        }: {
            author?: string;
            labels?: string[];
            sort?: 'created' | 'updated';
            order?: 'asc' | 'desc';
            page?: number;
            perPage?: number;
        }
    ): Promise<PRSummary[]> {
        try {
            const octokit = new Octokit({ auth: accessToken });
            let q = `repo:mdn/translated-content is:pr is:open`;
            if (author && author.trim()) q += ` author:${author.trim()}`;
            if (labels && labels.length > 0) {
                for (const l of labels) {
                    const label = l.trim();
                    if (!label) continue;
                    // quote label if contains spaces
                    const quoted = /\s/.test(label) ? `\"${label}\"` : label;
                    q += ` label:${quoted}`;
                }
            }
            const res = await octokit.request('GET /search/issues', {
                q,
                sort,
                order,
                page,
                per_page: perPage,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });
            if (res.status !== 200) throw new Error(I18N.msgGitHubUnknownError);
            const items = (res.data as any).items as any[];
            return items.map((it) => ({
                number: it.number,
                title: it.title,
                author: it.user?.login ?? '',
                labels: (it.labels || []).map((lb: any) => (typeof lb === 'string' ? lb : lb.name)),
                createdAt: it.created_at,
                updatedAt: it.updated_at,
            }));
        } catch (error: any) {
            handleGitHubError(error);
        }
    }

    static async fetchLabels(accessToken: string | undefined): Promise<{ name: string; color: string }[]> {
        try {
            const octokit = new Octokit({ auth: accessToken });
            const owner = 'mdn';
            const repo = 'translated-content';
            const headers = { 'X-GitHub-Api-Version': '2022-11-28' } as const;
            const all: { name: string; color: string }[] = [];
            let page = 1;
            while (page <= 10) {
                const res = await octokit.request('GET /repos/{owner}/{repo}/labels', {
                    owner,
                    repo,
                    page,
                    per_page: 100,
                    headers,
                });
                if (res.status !== 200) break;
                const batch = (res.data as any[]).map((l) => ({ name: l.name as string, color: l.color as string }));
                all.push(...batch);
                if (batch.length < 100) break;
                page++;
            }
            // sort alpha by name
            return all.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error: any) {
            handleGitHubError(error);
        }
    }
}

export default PullRequest;
