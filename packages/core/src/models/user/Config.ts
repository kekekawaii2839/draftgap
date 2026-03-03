import { RiskLevel } from "../../risk/risk-level";

export type StatsSite = "op.gg" | "u.gg" | "lolalytics";

export const RankTier = [
    "challenger",
    "grandmaster",
    "grandmaster_plus",
    "master",
    "master_plus",
    "diamond",
    "diamond_plus",
    "emerald_plus",
    "emerald",
    "platinum_plus",
    "platinum",
    "gold_plus",
    "gold",
    "silver",
    "bronze",
    "iron",
    "all",
] as const;
export type RankTier = (typeof RankTier)[number];

export const displayNameByRankTier: Record<RankTier, string> = {
    challenger: "Challenger",
    grandmaster: "Grandmaster",
    grandmaster_plus: "Grandmaster+",
    master: "Master",
    master_plus: "Master+",
    diamond: "Diamond",
    diamond_plus: "Diamond+",
    emerald_plus: "Emerald+",
    emerald: "Emerald",
    platinum_plus: "Platinum+",
    platinum: "Platinum",
    gold_plus: "Gold+",
    gold: "Gold",
    silver: "Silver",
    bronze: "Bronze",
    iron: "Iron",
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
