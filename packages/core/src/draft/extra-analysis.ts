import { defaultChampionRoleData } from "../models/dataset/ChampionRoleData";
import { Dataset } from "../models/dataset/Dataset";
import { Role } from "../models/Role";
import { winrateToRating } from "../rating/ratings";
import { priorGamesByRiskLevel } from "../risk/risk-level";
import { addStats } from "../stats";
import { AnalyzeDraftConfig } from "./analysis";

export function getChampionScalingDeltas(
    fullDataset: Dataset,
    championKey: string,
    role: Role,
    priorGames: number,
): number[] {
    const champion =
        fullDataset.championData[championKey]?.statsByRole[role] ??
        defaultChampionRoleData();

    const baseChampionStats = addStats(champion, {
        games: priorGames,
        wins: priorGames * 0.5,
    });
    const baseChampionWinrate = baseChampionStats.wins / baseChampionStats.games;
    const baseChampionRating = winrateToRating(baseChampionWinrate);

    return Array.from({ length: 5 }, (_, i) => {
        const championTime = champion.statsByTime[i];
        const championStats = addStats(championTime, {
            games: priorGames,
            wins: priorGames * baseChampionWinrate,
        });
        return winrateToRating(championStats.wins / championStats.games) - baseChampionRating;
    });
}

export function analyzeDraftExtra(
    dataset: Dataset,
    fullDataset: Dataset,
    team: Map<Role, string>,
    enemy: Map<Role, string>,
    config: AnalyzeDraftConfig,
) {
    const priorGames = priorGamesByRiskLevel[config.riskLevel];

    const ally = [...team.entries()];
    const allChampionDeltas = ally.map(([role, championKey]) => ({
        championKey,
        role,
        deltas: getChampionScalingDeltas(fullDataset, championKey, role, priorGames),
    }));

    return {
        ratingByTime: Array.from({ length: 5 }).map((_, i) => {
            const championResults = allChampionDeltas.map((c) => ({
                championKey: c.championKey,
                role: c.role,
                rating: c.deltas[i],
            }));
            return {
                championResults,
                totalRating: championResults.reduce((acc, c) => acc + c.rating, 0),
            };
        }),
    };
}

export type DraftExtraAnalysis = ReturnType<typeof analyzeDraftExtra>;
