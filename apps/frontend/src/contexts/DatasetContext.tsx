import {
    JSXElement,
    createContext,
    createEffect,
    createResource,
    useContext,
} from "solid-js";
import {
    DATASET_VERSION,
    Dataset,
} from "@draftgap/core/src/models/dataset/Dataset";
import { RankTier } from "@draftgap/core/src/models/user/Config";
import { useUser } from "./UserContext";
import {
    getCachedDataset,
    setCachedDataset,
} from "../utils/datasetCache";

const GITHUB_DATASETS_URL =
    "https://raw.githubusercontent.com/kekekawaii2839/draftgap/datasets";

function getDatasetUrl(tier: RankTier, period: string): string {
    if (tier === "emerald_plus") {
        return `https://bucket.draftgap.com/datasets/v${DATASET_VERSION}/${period}.json`;
    }
    return `${GITHUB_DATASETS_URL}/${tier}-${period}.json`;
}

async function fetchDatasetWithCache(
    tier: RankTier,
    period: string,
): Promise<Dataset | undefined> {
    try {
        const cached = await getCachedDataset(tier, period);
        if (cached) return cached;

        const url = getDatasetUrl(tier, period);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const dataset = (await response.json()) as Dataset;

        await setCachedDataset(tier, period, dataset);
        return dataset;
    } catch (err) {
        console.error(`Failed to fetch dataset [${tier}/${period}]:`, err);
        return undefined;
    }
}

function createDatasetContext() {
    const { config } = useUser();

    const [dataset] = createResource(
        () => config.rankTier,
        (tier) => fetchDatasetWithCache(tier, "current-patch"),
    );

    const [dataset30Days] = createResource(
        () => config.rankTier,
        (tier) => fetchDatasetWithCache(tier, "30-days"),
    );

    const isLoaded = () =>
        dataset() !== undefined && dataset30Days() !== undefined;

    createEffect(() => {
        (window as any).DRAFTGAP_DEBUG = (window as any).DRAFTGAP_DEBUG || {};
        // eslint-disable-next-line solid/reactivity
        (window as any).DRAFTGAP_DEBUG.dataset = dataset;
        // eslint-disable-next-line solid/reactivity
        (window as any).DRAFTGAP_DEBUG.dataset30Days = dataset30Days;
    });

    return {
        dataset,
        dataset30Days,
        isLoaded,
    };
}

const DatasetContext = createContext<ReturnType<typeof createDatasetContext>>();

export function DatasetProvider(props: { children: JSXElement }) {
    return (
        <DatasetContext.Provider value={createDatasetContext()}>
            {props.children}
        </DatasetContext.Provider>
    );
}

export function useDataset() {
    const useCtx = useContext(DatasetContext);
    if (!useCtx) throw new Error("No DatasetContext found");

    return useCtx;
}
