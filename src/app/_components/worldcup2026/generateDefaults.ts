import { writeFileSync } from "fs";
import { join } from "path";
import {
  simulateWorldCup2026OnceStageParticipants,
  getTournamentConfederationCounts,
  type KnockoutRound,
} from "./worldcup2026Simulator";

const CONFED_ORDER = ["UEFA", "CONMEBOL", "CAF", "AFC", "CONCACAF", "OFC"];
const DRAW_PROB_PCT = 22;
const RUNS = 100_000;

const drawProb = DRAW_PROB_PCT / 100;
const tournamentConfedCounts = getTournamentConfederationCounts();

const stageDefs = [
  { key: "Round of 32", stage: "Round of 32" as KnockoutRound },
  { key: "Round of 16", stage: "Round of 16" as KnockoutRound },
  { key: "Quarterfinal", stage: "Quarterfinal" as KnockoutRound },
  { key: "Semifinal", stage: "Semifinal" as KnockoutRound },
  { key: "Third place", stage: "Third place" as KnockoutRound },
  { key: "Final", stage: "Final" as KnockoutRound },
];
const stageKeys = stageDefs.map((d) => d.key);

const sums: Record<string, Record<string, number>> = {};
const confedCountFreqs: Record<string, Record<string, number[]>> = {};
for (const d of stageDefs) {
  sums[d.key] = {};
  confedCountFreqs[d.key] = {};
}

console.log(`Running ${RUNS} simulations with drawProbPct=${DRAW_PROB_PCT}...`);

for (let i = 0; i < RUNS; i++) {
  const sim = simulateWorldCup2026OnceStageParticipants(drawProb);

  for (const stageKey of stageKeys) {
    const teams = sim.stageParticipants[stageKey as KnockoutRound];
    const confedCounts = new Map<string, number>();
    for (const t of teams) confedCounts.set(t.confed, (confedCounts.get(t.confed) ?? 0) + 1);

    for (const confed of CONFED_ORDER) {
      const cnt = confedCounts.get(confed) ?? 0;
      sums[stageKey][confed] = (sums[stageKey][confed] ?? 0) + cnt;

      if (!confedCountFreqs[stageKey][confed]) {
        confedCountFreqs[stageKey][confed] = [];
      }
      const arr = confedCountFreqs[stageKey][confed];
      while (arr.length <= cnt) arr.push(0);
      arr[cnt]++;
    }
  }

  if ((i + 1) % 10000 === 0) {
    console.log(`  ${i + 1} / ${RUNS}`);
  }
}

const avgCountsByStage: Record<string, Record<string, number>> = {};
for (const stageKey of stageKeys) {
  avgCountsByStage[stageKey] = {};
  for (const [confed, sum] of Object.entries(sums[stageKey])) {
    avgCountsByStage[stageKey][confed] = parseFloat((sum / RUNS).toFixed(4));
  }
}

const confedCountDists: Record<string, Record<string, number[]>> = {};
for (const stageKey of stageKeys) {
  confedCountDists[stageKey] = {};
  for (const [confed, freqs] of Object.entries(confedCountFreqs[stageKey])) {
    confedCountDists[stageKey][confed] = freqs.map((f) => parseFloat((f / RUNS).toFixed(6)));
  }
}

const result = {
  runs: RUNS,
  drawProbPct: DRAW_PROB_PCT,
  tournamentConfedCounts,
  avgCountsByStage,
  confedCountDists,
};

const outPath = join(import.meta.dirname, "defaultAggregated.json");
writeFileSync(outPath, JSON.stringify(result, null, 2) + "\n");
console.log(`Written to ${outPath}`);
