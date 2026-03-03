import { RiskLevel } from "../../risk/risk-level";

export type StatsSite = "op.gg" | "u.gg" | "lolalytics";

export const RankTier = ["diamond_plus", "emerald_plus", "gold_plus"] as const;
export type RankTier = (typeof RankTier)[number];

export const displayNameByRankTier: Record<RankTier, string> = {
    diamond_plus: "Diamond+",
    emerald_plus: "Emerald+",
    gold_plus: "Gold+",
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
