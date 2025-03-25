import { Octokit } from '@octokit/core';
import { DecomposePath } from '@utils/path';

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
        const prDetailsEndpoint = `GET /repos/mdn/translated-content/pulls/${prId}`,
            prDetailsResponse = await octokit.request(prDetailsEndpoint, {
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });

        if (prDetailsResponse.status === 404) {
            throw new Error('Resource not found');
        } else if (prDetailsResponse.status === 403) {
            throw new Error('Forbidden');
        }

        const prDetailsJSON = await prDetailsResponse.data,
            title = prDetailsJSON.title,
            owner = prDetailsJSON.head.repo.owner.login,
            branch = prDetailsJSON.head.ref;

        const prFilesEndpoint = `GET /repos/mdn/translated-content/pulls/${prId}/files`,
            prFilesResponse = await octokit.request(prFilesEndpoint, {
                perPage: 3000,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });

        if (prFilesResponse.status === 404) {
            throw new Error('Resource not found');
        } else if (prFilesResponse.status === 403) {
            throw new Error('Forbidden');
        }

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
    }
}

export default PullRequest;
