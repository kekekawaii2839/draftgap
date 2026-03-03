import { RiskLevel } from "../../risk/risk-level";

export type StatsSite = "op.gg" | "u.gg" | "lolalytics";

export const RankTier = [
    "master_plus",
    "diamond_plus",
    "emerald_plus",
    "platinum_plus",
    "gold_plus",
    "all",
] as const;
export type RankTier = (typeof RankTier)[number];

export const displayNameByRankTier: Record<RankTier, string> = {
    master_plus: "Master+",
    diamond_plus: "Diamond+",
    emerald_plus: "Emerald+",
    platinum_plus: "Platinum+",
    gold_plus: "Gold+",
    all: "All Ranks",
};

export const DraftTablePlacement = {
    Bottom: "bottom",
    Hidden: "hidden",
    InPlace: "in-place",
} as const;
type DraftTablePlacement =
    (typeof DraftTablePlacement)[keyof typeof DraftTablePlacement];

export type DraftGapConfig = {
    // DRAFT ANALYSIS
    ignoreChampionWinrates: boolean;
    riskLevel: RiskLevel;
    minGames: number;
    rankTier: RankTier;

    // DRAFT SUGGESTIONS
    showFavouritesAtTop: boolean;
    banPlacement: DraftTablePlacement;
    unownedPlacement: DraftTablePlacement;
    showAdvancedWinrates: boolean;
    language: string;

    // MISC
    defaultStatsSite: StatsSite;
    enableBetaFeatures: boolean;

    // LOL CLIENT
    disableLeagueClientIntegration: boolean;
};
