import type { Dataset } from "@draftgap/core/src/models/dataset/Dataset";
import type { RankTier } from "@draftgap/core/src/models/user/Config";

const CACHE_NAME = "draftgap-datasets";
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function cacheUrl(tier: RankTier, period: string) {
    // Use a fake URL as the cache key
    return `cache://draftgap/datasets/${tier}/${period}`;
}

function timestampKey(tier: RankTier, period: string) {
    return `draftgap_dataset_fetched_at_${tier}_${period}`;
}

export async function getCachedDataset(
    tier: RankTier,
    period: string,
): Promise<Dataset | null> {
    try {
        const fetchedAt = localStorage.getItem(timestampKey(tier, period));
        if (!fetchedAt) return null;
        if (Date.now() - parseInt(fetchedAt) > TTL_MS) return null;

        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(cacheUrl(tier, period));
        if (!response) return null;

        return response.json() as Promise<Dataset>;
    } catch {
        return null;
    }
}

export async function setCachedDataset(
    tier: RankTier,
    period: string,
    dataset: Dataset,
): Promise<void> {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(
            cacheUrl(tier, period),
            new Response(JSON.stringify(dataset), {
                headers: { "Content-Type": "application/json" },
            }),
        );
        localStorage.setItem(timestampKey(tier, period), Date.now().toString());
    } catch {
        // Ignore cache write errors (e.g. storage quota exceeded)
    }
}

export function clearCachedDataset(tier: RankTier, period: string) {
    localStorage.removeItem(timestampKey(tier, period));
    caches.open(CACHE_NAME).then((cache) => cache.delete(cacheUrl(tier, period)));
}
