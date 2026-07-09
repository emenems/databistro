export type WorldCup2026ScenarioProbabilities = {
  pUefaGe6: number;
  pUefaGe7: number;
  pUefaGe8: number;
  pCafLe1: number;
  pCafLe2: number;
};

type Confed = "UEFA" | "CAF" | "AFC" | "CONCACAF" | "CONMEBOL" | "OFC";

type GroupEntry = {
  top2UefaCount: number; // 0..2
  top2CafCount: number; // 0..2
  thirdPoints: number; // 0..9
  thirdIsUefa: boolean;
  thirdIsCaf: boolean;
  prob: number;
};

type QualifiedCountDist = number[]; // index = #teams from a confed among qualified 32 teams

export type Team = {
  name: string;
  confed: Confed;
};

const GROUPS: { label: string; teams: Team[] }[] = [
  // Data based on the user-provided World Cup 2026 groups
  {
    label: "A",
    teams: [
      { name: "Mexico", confed: "CONCACAF" },
      { name: "South Africa", confed: "CAF" },
      { name: "South Korea", confed: "AFC" },
      { name: "Czechia", confed: "UEFA" },
    ],
  },
  {
    label: "B",
    teams: [
      { name: "Canada", confed: "CONCACAF" },
      { name: "Bosnia and Herzegovina", confed: "UEFA" },
      { name: "Qatar", confed: "AFC" },
      { name: "Switzerland", confed: "UEFA" },
    ],
  },
  {
    label: "C",
    teams: [
      { name: "Brazil", confed: "CONMEBOL" },
      { name: "Morocco", confed: "CAF" },
      { name: "Haiti", confed: "CONCACAF" },
      { name: "Scotland", confed: "UEFA" },
    ],
  },
  {
    label: "D",
    teams: [
      { name: "United States", confed: "CONCACAF" },
      { name: "Paraguay", confed: "CONMEBOL" },
      { name: "Australia", confed: "AFC" },
      { name: "Turkey", confed: "UEFA" },
    ],
  },
  {
    label: "E",
    teams: [
      { name: "Germany", confed: "UEFA" },
      { name: "Curaçao", confed: "CONCACAF" },
      { name: "Ivory Coast", confed: "CAF" },
      { name: "Ecuador", confed: "CONMEBOL" },
    ],
  },
  {
    label: "F",
    teams: [
      { name: "Netherlands", confed: "UEFA" },
      { name: "Japan", confed: "AFC" },
      { name: "Sweden", confed: "UEFA" },
      { name: "Tunisia", confed: "CAF" },
    ],
  },
  {
    label: "G",
    teams: [
      { name: "Belgium", confed: "UEFA" },
      { name: "Egypt", confed: "CAF" },
      { name: "Iran", confed: "AFC" },
      { name: "New Zealand", confed: "OFC" },
    ],
  },
  {
    label: "H",
    teams: [
      { name: "Spain", confed: "UEFA" },
      { name: "Cape Verde", confed: "CAF" },
      { name: "Saudi Arabia", confed: "AFC" },
      { name: "Uruguay", confed: "CONMEBOL" },
    ],
  },
  {
    label: "I",
    teams: [
      { name: "France", confed: "UEFA" },
      { name: "Senegal", confed: "CAF" },
      { name: "Iraq", confed: "AFC" },
      { name: "Norway", confed: "UEFA" },
    ],
  },
  {
    label: "J",
    teams: [
      { name: "Argentina", confed: "CONMEBOL" },
      { name: "Algeria", confed: "CAF" },
      { name: "Austria", confed: "UEFA" },
      { name: "Jordan", confed: "AFC" },
    ],
  },
  {
    label: "K",
    teams: [
      { name: "Portugal", confed: "UEFA" },
      { name: "DR Congo", confed: "CAF" },
      { name: "Uzbekistan", confed: "AFC" },
      { name: "Colombia", confed: "CONMEBOL" },
    ],
  },
  {
    label: "L",
    teams: [
      { name: "England", confed: "UEFA" },
      { name: "Croatia", confed: "UEFA" },
      { name: "Ghana", confed: "CAF" },
      { name: "Panama", confed: "CONCACAF" },
    ],
  },
];

function factorial(n: number): number {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function buildCombinations(maxN: number): number[][] {
  const choose: number[][] = Array.from({ length: maxN + 1 }, () => Array(maxN + 1).fill(0));
  for (let n = 0; n <= maxN; n++) {
    choose[n][0] = 1;
    choose[n][n] = 1;
    for (let k = 1; k < n; k++) {
      choose[n][k] = choose[n - 1][k - 1] + choose[n - 1][k];
    }
  }
  return choose;
}

function computeGroupEntries(drawProb: number): GroupEntry[][] {
  const pDraw = drawProb;
  const pWin = (1 - pDraw) / 2;

  const matchPairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  const allGroups: GroupEntry[][] = [];

  for (const group of GROUPS) {
    const confeds = group.teams.map((t) => t.confed);
    const map = new Map<string, number>();

    const points = [0, 0, 0, 0];

    const dfs = (matchIdx: number, probAcc: number) => {
      if (matchIdx === matchPairs.length) {
        // Rank teams by points, break ties uniformly at random.
        const indices = [0, 1, 2, 3];
        const uniquePoints = Array.from(new Set(points)).sort((a, b) => b - a);
        const tieGroups = uniquePoints.map((p) => indices.filter((i) => points[i] === p));

        const permCount = tieGroups.reduce((acc, g) => acc * factorial(g.length), 1);

        // Generate all rank orders by permuting within each tie group.
        const rankOrder: number[] = [];
        const permuteGroups = (gIdx: number) => {
          if (gIdx === tieGroups.length) {
            const winnerIdx = rankOrder[0];
            const runnerUpIdx = rankOrder[1];
            const thirdIdx = rankOrder[2];

            const top2UefaCount =
              (confeds[winnerIdx] === "UEFA" ? 1 : 0) + (confeds[runnerUpIdx] === "UEFA" ? 1 : 0);
            const top2CafCount =
              (confeds[winnerIdx] === "CAF" ? 1 : 0) + (confeds[runnerUpIdx] === "CAF" ? 1 : 0);

            const thirdIsUefa = confeds[thirdIdx] === "UEFA";
            const thirdIsCaf = confeds[thirdIdx] === "CAF";
            const thirdPoints = points[thirdIdx];

            const key = `${top2UefaCount}|${top2CafCount}|${thirdPoints}|${thirdIsUefa ? 1 : 0}|${
              thirdIsCaf ? 1 : 0
            }`;
            const prev = map.get(key) ?? 0;
            map.set(key, prev + probAcc / permCount);
            return;
          }

          const groupIndices = tieGroups[gIdx];

          const permuteArray = (arr: number[], startIdx: number) => {
            if (startIdx === arr.length) {
              rankOrder.push(...arr);
              permuteGroups(gIdx + 1);
              rankOrder.length -= arr.length;
              return;
            }
            for (let i = startIdx; i < arr.length; i++) {
              [arr[startIdx], arr[i]] = [arr[i], arr[startIdx]];
              permuteArray(arr, startIdx + 1);
              [arr[startIdx], arr[i]] = [arr[i], arr[startIdx]];
            }
          };

          // To avoid mutating tieGroups, copy before permuting.
          permuteArray([...groupIndices], 0);
        };

        permuteGroups(0);
        return;
      }

      const [a, b] = matchPairs[matchIdx];

      // a wins
      points[a] += 3;
      dfs(matchIdx + 1, probAcc * pWin);
      points[a] -= 3;

      // b wins
      points[b] += 3;
      dfs(matchIdx + 1, probAcc * pWin);
      points[b] -= 3;

      // draw
      points[a] += 1;
      points[b] += 1;
      dfs(matchIdx + 1, probAcc * pDraw);
      points[a] -= 1;
      points[b] -= 1;
    };

    dfs(0, 1);

    const entries: GroupEntry[] = [];
    map.forEach((prob, key) => {
      const [top2UefaCountStr, top2CafCountStr, thirdPointsStr, thirdIsUefaStr, thirdIsCafStr] = key.split("|");
      entries.push({
        top2UefaCount: Number(top2UefaCountStr),
        top2CafCount: Number(top2CafCountStr),
        thirdPoints: Number(thirdPointsStr),
        thirdIsUefa: thirdIsUefaStr === "1",
        thirdIsCaf: thirdIsCafStr === "1",
        prob,
      });
    });

    allGroups.push(entries);
  }

  return allGroups;
}

function hypergeometricP(
  choose: number[][],
  populationSize: number,
  successPopulation: number,
  sampleSize: number,
  successSample: number
): number {
  if (successSample < 0 || successSample > sampleSize) return 0;
  const failurePopulation = populationSize - successPopulation;
  const failureSample = sampleSize - successSample;
  if (failureSample < 0 || failureSample > failurePopulation) return 0;

  return (
    (choose[successPopulation][successSample] * choose[failurePopulation][failureSample]) / choose[populationSize][sampleSize]
  );
}

function computeQualifiedConfedCountDist(
  groupEntries: GroupEntry[][],
  confed: "UEFA" | "CAF",
  choose: number[][]
): QualifiedCountDist {
  // DP state for a fixed cutoff t:
  // uSoFar = confed count among:
  //   - all group top2 teams (24 teams) up to the processed groups
  //   - plus third-placed teams with points > t (which are already selected)
  //
  // kGreater = number of third-placed teams among processed groups with points > t
  // uEqual = number of third-placed teams among processed groups with points == t whose team is the confed
  // totalEqual = total number of third-placed teams among processed groups with points == t
  const qualifiedDist: QualifiedCountDist = Array(33).fill(0);

  const maxKGreater = 7; // by definition of the cutoff t for "top 8"
  const uSoFarMax = 32;
  const uEqualMax = 12;
  const totalEqualMax = 12;
  const K = maxKGreater + 1;

  const dpLen = (uSoFarMax + 1) * K * (uEqualMax + 1) * (totalEqualMax + 1);

  const idx = (uSoFar: number, kGreater: number, uEqual: number, totalEqual: number) =>
    (((uSoFar * K + kGreater) * (uEqualMax + 1) + uEqual) * (totalEqualMax + 1) + totalEqual);

  const cutoffValues = Array.from({ length: 10 }, (_, i) => i); // thirdPoints can be 0..9

  for (const cutoffT of cutoffValues) {
    let dp = new Float64Array(dpLen);
    dp[idx(0, 0, 0, 0)] = 1;

    for (let g = 0; g < GROUPS.length; g++) {
      const next = new Float64Array(dpLen);
      const entries = groupEntries[g];

      for (let uSoFar = 0; uSoFar <= uSoFarMax; uSoFar++) {
        for (let kGreater = 0; kGreater <= maxKGreater; kGreater++) {
          for (let uEqual = 0; uEqual <= uEqualMax; uEqual++) {
            for (let totalEqual = 0; totalEqual <= totalEqualMax; totalEqual++) {
              const cur = dp[idx(uSoFar, kGreater, uEqual, totalEqual)];
              if (cur === 0) continue;

              for (const e of entries) {
                const top2Count = confed === "UEFA" ? e.top2UefaCount : e.top2CafCount;
                const thirdIs = confed === "UEFA" ? e.thirdIsUefa : e.thirdIsCaf;

                const thirdPoints = e.thirdPoints;

                const uSoFarBase = uSoFar + top2Count;

                if (thirdPoints > cutoffT) {
                  const k2 = kGreater + 1;
                  if (k2 > maxKGreater) continue;

                  const u2 = uSoFarBase + (thirdIs ? 1 : 0);
                  if (u2 > uSoFarMax) continue;

                  next[idx(u2, k2, uEqual, totalEqual)] += cur * e.prob;
                } else if (thirdPoints === cutoffT) {
                  const totalEqual2 = totalEqual + 1;
                  if (totalEqual2 > totalEqualMax) continue;

                  const uEqual2 = uEqual + (thirdIs ? 1 : 0);
                  if (uEqual2 > uEqualMax) continue;

                  if (uSoFarBase > uSoFarMax) continue;
                  next[idx(uSoFarBase, kGreater, uEqual2, totalEqual2)] += cur * e.prob;
                } else {
                  // thirdPoints < cutoffT -> not selected
                  if (uSoFarBase > uSoFarMax) continue;
                  next[idx(uSoFarBase, kGreater, uEqual, totalEqual)] += cur * e.prob;
                }
              }
            }
          }
        }
      }

      dp = next;
    }

    // Finish this cutoff: select exactly 8 - kGreater teams from the "equal points" pool.
    for (let uSoFar = 0; uSoFar <= uSoFarMax; uSoFar++) {
      for (let kGreater = 0; kGreater <= maxKGreater; kGreater++) {
        for (let uEqual = 0; uEqual <= uEqualMax; uEqual++) {
          for (let totalEqual = 0; totalEqual <= totalEqualMax; totalEqual++) {
            const cur = dp[idx(uSoFar, kGreater, uEqual, totalEqual)];
            if (cur === 0) continue;

            if (kGreater > maxKGreater) continue;
            if (kGreater + totalEqual < 8) continue; // not enough teams with points >= cutoffT

            const neededFromEqual = 8 - kGreater;
            if (neededFromEqual < 0 || neededFromEqual > totalEqual) continue;

            // Multivariate hypergeometric within the tied pool:
            // choose uSel confed teams and (neededFromEqual - uSel) non-confed teams.
            const denom = choose[totalEqual][neededFromEqual];
            if (denom === 0) continue;

            const nonConfedEqual = totalEqual - uEqual;

            const uSelMin = Math.max(0, neededFromEqual - nonConfedEqual);
            const uSelMax = Math.min(neededFromEqual, uEqual);
            for (let uSel = uSelMin; uSel <= uSelMax; uSel++) {
              const num = choose[uEqual][uSel] * choose[nonConfedEqual][neededFromEqual - uSel];
              const pSel = num / denom;
              const qualifiedCount = uSoFar + uSel;
              if (qualifiedCount <= 32) {
                qualifiedDist[qualifiedCount] += cur * pSel;
              }
            }
          }
        }
      }
    }
  }

  return qualifiedDist;
}

export function computeWorldCup2026QuarterfinalScenarioProbabilities(
  drawProbability: number
): WorldCup2026ScenarioProbabilities {
  const drawProb = Math.min(1, Math.max(0, drawProbability));
  const choose = buildCombinations(32);

  const groupEntries = computeGroupEntries(drawProb);

  const qualifiedUefa = computeQualifiedConfedCountDist(groupEntries, "UEFA", choose);
  const qualifiedCaf = computeQualifiedConfedCountDist(groupEntries, "CAF", choose);

  // Quarterfinals: 8 out of 32 teams (equal-strength + symmetric bracket model).
  const populationSize = 32;
  const sampleSize = 8;

  const pUefaGe6 =
    qualifiedUefa.reduce((acc, p, nUefa) => {
      if (p === 0) return acc;
      let local = 0;
      for (let k = 6; k <= sampleSize; k++) {
        local += hypergeometricP(choose, populationSize, nUefa, sampleSize, k);
      }
      return acc + p * local;
    }, 0);

  const pUefaGe7 =
    qualifiedUefa.reduce((acc, p, nUefa) => {
      if (p === 0) return acc;
      let local = 0;
      for (let k = 7; k <= sampleSize; k++) {
        local += hypergeometricP(choose, populationSize, nUefa, sampleSize, k);
      }
      return acc + p * local;
    }, 0);

  const pUefaGe8 =
    qualifiedUefa.reduce((acc, p, nUefa) => {
      if (p === 0) return acc;
      const local = hypergeometricP(choose, populationSize, nUefa, sampleSize, 8);
      return acc + p * local;
    }, 0);

  const pCafLe1 =
    qualifiedCaf.reduce((acc, p, nCaf) => {
      if (p === 0) return acc;
      let local = 0;
      for (let k = 0; k <= 1; k++) {
        local += hypergeometricP(choose, populationSize, nCaf, sampleSize, k);
      }
      return acc + p * local;
    }, 0);

  const pCafLe2 =
    qualifiedCaf.reduce((acc, p, nCaf) => {
      if (p === 0) return acc;
      let local = 0;
      for (let k = 0; k <= 2; k++) {
        local += hypergeometricP(choose, populationSize, nCaf, sampleSize, k);
      }
      return acc + p * local;
    }, 0);

  return {
    pUefaGe6,
    pUefaGe7,
    pUefaGe8,
    pCafLe1,
    pCafLe2,
  };
}

export type SimulatedGroupMatch = {
  home: string;
  away: string;
  outcome: "home" | "away" | "draw";
};

export type SimulatedGroupRow = {
  rank: number;
  team: string;
  confed: Confed;
  played: number; // always 3 in groups
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type SimulatedGroup = {
  label: string;
  matches: SimulatedGroupMatch[];
  table: SimulatedGroupRow[];
};

export type SimulatedWorldCup2026 = {
  groups: SimulatedGroup[];
  quarterfinalists: Team[];
  qualified32: Team[]; // teams that reached the knockout stage (Round of 16)
  quarterfinalUefaCount: number;
  quarterfinalCafCount: number;
  knockoutMatches: KnockoutMatch[];
  champion: Team;
  thirdPlace: Team;
};

export type KnockoutRound =
  | "Round of 32"
  | "Round of 16"
  | "Quarterfinal"
  | "Semifinal"
  | "Third place"
  | "Final";

export type KnockoutMatch = {
  round: KnockoutRound;
  matchNo: number; // numbering inside the round
  team1: Team;
  team2: Team;
  winner: Team;
};

export type StageParticipants = {
  "Round of 32": Team[];
  "Round of 16": Team[];
  Quarterfinal: Team[];
  Semifinal: Team[];
  "Third place": Team[];
  Final: Team[];
};

export type SimulatedStageResult = {
  qualified32: Team[];
  stageParticipants: StageParticipants;
};

export function getTournamentConfederationCounts(): Record<string, number> {
  const counts = new Map<string, number>();
  for (const group of GROUPS) {
    for (const t of group.teams) {
      counts.set(t.confed, (counts.get(t.confed) ?? 0) + 1);
    }
  }
  return Object.fromEntries(counts.entries());
}

/**
 * Light-weight simulation for aggregation:
 * - simulate group stage to decide qualified 24 + best 8 third teams (32 teams)
 * - simulate knockout bracket through Round of 16 + Quarterfinal + Semifinal + Third place + Final
 * - return only stage participant teams (no group tables / no match list)
 */
export function simulateWorldCup2026OnceStageParticipants(
  drawProbability: number,
  rand: () => number = Math.random,
): SimulatedStageResult {
  const pDraw = clamp01(drawProbability);
  const pWin = (1 - pDraw) / 2;

  const matchPairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  const qualified24: Team[] = [];
  const thirdPlaced: { team: Team; points: number }[] = [];

  for (const group of GROUPS) {
    const teams = group.teams;
    const points = [0, 0, 0, 0];

    for (const [a, b] of matchPairs) {
      const r = rand();
      if (r < pDraw) {
        points[a] += 1;
        points[b] += 1;
      } else if (r < pDraw + pWin) {
        // home wins
        points[a] += 3;
      } else {
        // away wins
        points[b] += 3;
      }
    }

    // Rank teams by points, break ties randomly (uniform permutations inside each point bucket).
    const indices = [0, 1, 2, 3];
    const buckets = new Map<number, number[]>();
    for (const i of indices) {
      const p = points[i];
      const arr = buckets.get(p) ?? [];
      arr.push(i);
      buckets.set(p, arr);
    }

    const rankedIndices: number[] = [];
    const sortedPoints = Array.from(buckets.keys()).sort((x, y) => y - x);
    for (const p of sortedPoints) {
      const bucket = (buckets.get(p) ?? []).slice();
      shuffleInPlace(bucket, rand);
      rankedIndices.push(...bucket);
    }

    const winnerIdx = rankedIndices[0];
    const runnerUpIdx = rankedIndices[1];
    const thirdIdx = rankedIndices[2];

    qualified24.push(teams[winnerIdx], teams[runnerUpIdx]);
    thirdPlaced.push({ team: teams[thirdIdx], points: points[thirdIdx] });
  }

  // Pick best 8 third-placed teams by points (randomly when tied on cutoff).
  thirdPlaced.sort((x, y) => y.points - x.points);
  const cutoffPoints = thirdPlaced[Math.min(7, thirdPlaced.length - 1)].points;
  const greater = thirdPlaced.filter((t) => t.points > cutoffPoints);
  const equal = thirdPlaced.filter((t) => t.points === cutoffPoints);

  const needed = 8 - greater.length;
  const chosenEqual = equal.slice();
  shuffleInPlace(chosenEqual, rand);
  const selectedThird = greater.concat(chosenEqual.slice(0, Math.max(0, needed))).map((x) => x.team);

  const qualified32 = qualified24.concat(selectedThird);

  // Knockout bracket participants
  const shuffled = qualified32.slice();
  shuffleInPlace(shuffled, rand);

  // Round of 32: 32 -> 16
  const roundOf32PairsWinners: Team[] = [];
  for (let i = 0; i < 32; i += 2) {
    const t1 = shuffled[i];
    const t2 = shuffled[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    roundOf32PairsWinners.push(winner);
  }

  // Round of 16: 16 -> 8
  const roundOf16Participants = roundOf32PairsWinners; // teams in that round
  const quarterfinalists: Team[] = [];
  for (let i = 0; i < roundOf16Participants.length; i += 2) {
    const t1 = roundOf16Participants[i];
    const t2 = roundOf16Participants[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    quarterfinalists.push(winner);
  }

  // Quarterfinal: 8 -> 4
  const semifinalists: Team[] = [];
  for (let i = 0; i < quarterfinalists.length; i += 2) {
    const t1 = quarterfinalists[i];
    const t2 = quarterfinalists[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    semifinalists.push(winner);
  }

  // Semifinal: 4 -> 2
  const finalists: Team[] = [];
  const semiLosers: Team[] = [];
  for (let i = 0; i < semifinalists.length; i += 2) {
    const t1 = semifinalists[i];
    const t2 = semifinalists[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    const loser = winner.name === t1.name ? t2 : t1;
    finalists.push(winner);
    semiLosers.push(loser);
  }

  const thirdPlaceTeams = semiLosers;

  return {
    qualified32,
    stageParticipants: {
      "Round of 32": qualified32,
      "Round of 16": roundOf16Participants,
      Quarterfinal: quarterfinalists,
      Semifinal: semifinalists,
      "Third place": thirdPlaceTeams,
      Final: finalists,
    },
  };
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function shuffleInPlace<T>(arr: T[], rand: () => number) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * One "fun" tournament example: exact group-stage random outcomes (with configurable draw prob),
 * random tie-break when points are equal, then a randomized Round of 16 bracket (coin flips, no draws)
 * to get an example quarterfinalists set.
 */
export function simulateWorldCup2026Once(drawProbability: number, rand: () => number = Math.random): SimulatedWorldCup2026 {
  const pDraw = clamp01(drawProbability);
  const pWin = (1 - pDraw) / 2;

  const matchPairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  const groups: SimulatedGroup[] = [];

  const qualified24: Team[] = [];
  const thirdPlaced: { team: Team; points: number }[] = [];

  for (const group of GROUPS) {
    const teams = group.teams;
    const points = [0, 0, 0, 0];
    const wins = [0, 0, 0, 0];
    const draws = [0, 0, 0, 0];
    const losses = [0, 0, 0, 0];

    const matches: SimulatedGroupMatch[] = [];

    for (const [a, b] of matchPairs) {
      const r = rand();
      const home = teams[a].name;
      const away = teams[b].name;

      if (r < pDraw) {
        points[a] += 1;
        points[b] += 1;
        draws[a] += 1;
        draws[b] += 1;
        matches.push({ home, away, outcome: "draw" });
      } else if (r < pDraw + pWin) {
        // home wins
        points[a] += 3;
        wins[a] += 1;
        losses[b] += 1;
        matches.push({ home, away, outcome: "home" });
      } else {
        // away wins
        points[b] += 3;
        wins[b] += 1;
        losses[a] += 1;
        matches.push({ home, away, outcome: "away" });
      }
    }

    // Points-based ranking with randomized order inside point ties.
    const indices = [0, 1, 2, 3];
    const buckets = new Map<number, number[]>();
    for (const i of indices) {
      const p = points[i];
      const arr = buckets.get(p) ?? [];
      arr.push(i);
      buckets.set(p, arr);
    }

    const rankedIndices: number[] = [];
    const sortedPoints = Array.from(buckets.keys()).sort((x, y) => y - x);
    for (const p of sortedPoints) {
      const bucket = (buckets.get(p) ?? []).slice();
      shuffleInPlace(bucket, rand);
      rankedIndices.push(...bucket);
    }

    const table: SimulatedGroupRow[] = rankedIndices.map((idx, rankIdx) => ({
      rank: rankIdx + 1,
      team: teams[idx].name,
      confed: teams[idx].confed,
      played: 3,
      wins: wins[idx],
      draws: draws[idx],
      losses: losses[idx],
      points: points[idx],
    }));

    const winnerIdx = rankedIndices[0];
    const runnerUpIdx = rankedIndices[1];
    const thirdIdx = rankedIndices[2];

    qualified24.push(teams[winnerIdx], teams[runnerUpIdx]);
    thirdPlaced.push({ team: teams[thirdIdx], points: points[thirdIdx] });

    groups.push({ label: group.label, matches, table });
  }

  // Select best 8 third-placed teams by points (randomly when tied on cutoff points).
  thirdPlaced.sort((x, y) => y.points - x.points);
  const cutoffPoints = thirdPlaced[Math.min(7, thirdPlaced.length - 1)].points;
  const greater = thirdPlaced.filter((t) => t.points > cutoffPoints);
  const equal = thirdPlaced.filter((t) => t.points === cutoffPoints);

  const needed = 8 - greater.length;
  const chosenEqual = equal.slice();
  shuffleInPlace(chosenEqual, rand);
  const selectedThird = greater.concat(chosenEqual.slice(0, Math.max(0, needed))).map((x) => x.team);

  const qualified32 = qualified24.concat(selectedThird);

  // Randomized Round of 16 bracket (coin flips, no draws).
  const shuffled = qualified32.slice();
  shuffleInPlace(shuffled, rand);

  const knockoutMatches: KnockoutMatch[] = [];

  // Round of 32: 32 -> 16
  const winnersRoundOf16: Team[] = [];
  for (let i = 0; i < 32; i += 2) {
    const t1 = shuffled[i];
    const t2 = shuffled[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    winnersRoundOf16.push(winner);
    knockoutMatches.push({
      round: "Round of 32",
      matchNo: i / 2 + 1,
      team1: t1,
      team2: t2,
      winner,
    });
  }

  // Round of 16: 16 -> 8 (quarterfinalists)
  const quarterfinalists: Team[] = [];
  for (let i = 0; i < winnersRoundOf16.length; i += 2) {
    const t1 = winnersRoundOf16[i];
    const t2 = winnersRoundOf16[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    quarterfinalists.push(winner);
    knockoutMatches.push({
      round: "Round of 16",
      matchNo: i / 2 + 1,
      team1: t1,
      team2: t2,
      winner,
    });
  }

  // Quarterfinal: 8 -> 4
  const semifinalists: Team[] = [];
  for (let i = 0; i < quarterfinalists.length; i += 2) {
    const t1 = quarterfinalists[i];
    const t2 = quarterfinalists[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    semifinalists.push(winner);
    knockoutMatches.push({
      round: "Quarterfinal",
      matchNo: i / 2 + 1,
      team1: t1,
      team2: t2,
      winner,
    });
  }

  // Semifinal: 4 -> 2
  const semifinalLosers: Team[] = [];
  const finalists: Team[] = [];
  for (let i = 0; i < semifinalists.length; i += 2) {
    const t1 = semifinalists[i];
    const t2 = semifinalists[i + 1];
    const winner = rand() < 0.5 ? t1 : t2;
    const loser = winner.name === t1.name ? t2 : t1;
    finalists.push(winner);
    semifinalLosers.push(loser);
    knockoutMatches.push({
      round: "Semifinal",
      matchNo: i / 2 + 1,
      team1: t1,
      team2: t2,
      winner,
    });
  }

  // Third-place match
  const thirdPlaceMatchWinner = rand() < 0.5 ? semifinalLosers[0] : semifinalLosers[1];
  knockoutMatches.push({
    round: "Third place",
    matchNo: 1,
    team1: semifinalLosers[0],
    team2: semifinalLosers[1],
    winner: thirdPlaceMatchWinner,
  });

  // Final
  const finalWinner = rand() < 0.5 ? finalists[0] : finalists[1];
  knockoutMatches.push({
    round: "Final",
    matchNo: 1,
    team1: finalists[0],
    team2: finalists[1],
    winner: finalWinner,
  });

  const quarterfinalUefaCount = quarterfinalists.filter((t) => t.confed === "UEFA").length;
  const quarterfinalCafCount = quarterfinalists.filter((t) => t.confed === "CAF").length;

  return {
    groups,
    quarterfinalists,
    qualified32,
    quarterfinalUefaCount,
    quarterfinalCafCount,
    knockoutMatches,
    champion: finalWinner,
    thirdPlace: thirdPlaceMatchWinner,
  };
}

