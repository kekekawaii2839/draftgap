import { RiskLevel } from "../../risk/risk-level";

export type StatsSite = "op.gg" | "u.gg" | "lolalytics";

export const RankTier = [
    "grandmaster_plus",
    "master_plus",
    "diamond_plus",
    "emerald_plus",
    "emerald",
    "platinum",
    "gold",
    "silver",
    "bronze",
    "iron",
] as const;
export type RankTier = (typeof RankTier)[number];

export const displayNameByRankTier: Record<RankTier, string> = {
    grandmaster_plus: "Grandmaster+",
    master_plus: "Master+",
    diamond_plus: "Diamond+",
    emerald_plus: "Emerald+",
    emerald: "Emerald",
    platinum: "Platinum",
    gold: "Gold",
    silver: "Silver",
    bronze: "Bronze",
    iron: "Iron",
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
