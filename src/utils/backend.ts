export interface ChangeEntry { path: string; status: string; source_exists: boolean; translation_exists: boolean }
export interface ChangesResponse { changes: ChangeEntry[]; locale: string; base_ref: string }

export interface FileSide { content: string; exists: boolean; size: number; age_secs?: number; source_commit?: string }
export interface DiffResponse { path: string; locale: string; source: FileSide; translation: FileSide; diff: string }

export function createBackendClient(apiBase: string | undefined) {
    const base = (apiBase && apiBase.trim()) || 'http://localhost:3030';
    return {
        base,
        async fetchChanges(locale: string): Promise<ChangeEntry[]> {
            const url = `${base}/api/changes?locale=${encodeURIComponent(locale)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch changes: ${res.status}`);
            const data: ChangesResponse = await res.json();
            return data.changes;
        },
        async fetchDiff(locale: string, path: string): Promise<DiffResponse> {
            const url = `${base}/api/diff?locale=${encodeURIComponent(locale)}&path=${encodeURIComponent(path)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch diff: ${res.status}`);
            return res.json();
        },
    };
}
