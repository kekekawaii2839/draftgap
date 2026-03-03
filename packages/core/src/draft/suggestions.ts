import { Role, ROLES } from "../models/Role";
import { Dataset } from "../models/dataset/Dataset";
import { DraftResult, AnalyzeDraftConfig, analyzeDraft } from "./analysis";
import { getStats } from "./utils";
import { getChampionScalingDeltas } from "./extra-analysis";
import { priorGamesByRiskLevel } from "../risk/risk-level";

export interface Suggestion {
    championKey: string;
    role: Role;
    draftResult: DraftResult;
    scalingByTime: number[];
}

export function getSuggestions(
    dataset: Dataset,
    synergyMatchupDataset: Dataset,
    team: Map<Role, string>,
    enemy: Map<Role, string>,
    config: AnalyzeDraftConfig,
) {
    const remainingRoles = ROLES.filter((role) => !team.has(role));
    const enemyChampions = new Set(enemy.values());
    const allyChampions = new Set(team.values());
    const priorGames = priorGamesByRiskLevel[config.riskLevel];

    const existingScalingTotals = Array.from({ length: 5 }, (_, i) =>
        [...team.entries()].reduce(
            (acc, [role, key]) =>
                acc + getChampionScalingDeltas(synergyMatchupDataset, key, role, priorGames)[i],
            0,
        ),
    );

    const suggestions: Suggestion[] = [];

    for (const championKey of Object.keys(dataset.championData)) {
        if (enemyChampions.has(championKey) || allyChampions.has(championKey))
            continue;

        for (const role of remainingRoles) {
            if (team.has(role)) continue;
            if (
                (getStats(synergyMatchupDataset, championKey, role).games /
                    30) *
                    7 <
                config.minGames
            )
                continue;

            team.set(role, championKey);
            const draftResult = analyzeDraft(
                dataset,
                synergyMatchupDataset,
                team,
                enemy,
                config,
            );
            team.delete(role);

            const candidateDeltas = getChampionScalingDeltas(
                synergyMatchupDataset,
                championKey,
                role,
                priorGames,
            );
            const scalingByTime = existingScalingTotals.map(
                (total, i) => total + candidateDeltas[i],
            );

            suggestions.push({
                championKey,
                role,
                draftResult,
                scalingByTime,
            });
        }
    }

    return suggestions.sort(
        (a, b) => b.draftResult.winrate - a.draftResult.winrate,
    );
}
