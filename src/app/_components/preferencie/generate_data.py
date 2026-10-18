"""Build data.json for the "Prieskumy vs. výsledky volieb" post.

Reuses the analysis from https://github.com/emenems/databistro-preferencie (scripts/error_vs_time.py), so
the numbers are identical to that repo's README. Run from the databistro repo root:

    uv run --project ../databistro-preferencie python src/app/_components/preferencie/generate_data.py \
        ../databistro-preferencie

The argument is the path to a checkout of databistro-preferencie with data/processed/ filled in.
"""

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

repo = Path(sys.argv[1] if len(sys.argv) > 1 else "../databistro-preferencie").resolve()
sys.path.insert(0, str(repo / "scripts"))

import error_vs_time as ev  # noqa: E402
from preferencie.averaging import PartyPolls, to_day  # noqa: E402
from preferencie.paths import PROCESSED_DIR  # noqa: E402

# Estimated date of the next regular election (not announced yet) - keep in sync with the post text.
NEXT_ELECTION = "2027-09-25"

OUT = Path(__file__).with_name("data.json")


def r(v, n=2):
    return None if v is None or (isinstance(v, float) and np.isnan(v)) else round(float(v), n)


prefs, polls, res = ev.load()
avg, pe, _ = ev.build(prefs, polls, res)
colors = pd.read_csv(PROCESSED_DIR / "canonical_parties.csv").set_index("party_canonical")["color"].to_dict()

hs = ev.HORIZONS
n_elections = avg["election_year"].nunique()
full = avg.groupby("horizon")["election_year"].nunique().eq(n_elections)


def series(df, col="abs_error", f="mean", pooled=True):
    out = df.groupby("horizon")[col].agg(f).reindex(hs)
    if pooled:  # a pooled value is only comparable where every election has data
        out[~out.index.map(full).fillna(False).astype(bool)] = np.nan
    return [r(v) for v in out]


elections = {}
for y, g in pe.groupby("election_year"):
    date = res.loc[res["election_year"] == y, "election_date"].iloc[0]
    elections[int(y)] = {"date": str(date)[:10], "lastPoll": int(g["horizon"].min())}

agencies = sorted(pe["agency"].unique())
units = []
for (y, p), g in avg.groupby(["election_year", "party"]):
    a = g.set_index("horizon")["average"].reindex(hs)
    pl = pe[(pe["election_year"] == y) & (pe["party"] == p)]
    units.append({
        "year": int(y), "party": p, "color": colors.get(p, "#888888"), "result": r(g["result"].iloc[0]),
        "prior": r(g["prior_result"].iloc[0]),
        "avg": [r(v) for v in a],
        "polls": [[int(t.horizon), r(t.poll, 1), agencies.index(t.agency)] for t in pl.itertuples()],
    })

# "A 20 % party": relative deviation of parties that finished with >= 5 % (the parliament threshold), pooled over +-14 days around each
# horizon (3 weekly points) so the percentiles are not driven by a single day. Few units, so it is noisy.
PARLIAMENT = 5.0
big = avg[avg["result"] >= PARLIAMENT]
rel_big50, rel_big80, n_big = [], [], []
for h in hs:
    w = big[(big["horizon"] - h).abs() <= 14]
    units_n = w.groupby(["election_year", "party"]).ngroups
    if units_n < 5:
        rel_big50.append(None); rel_big80.append(None); n_big.append(units_n)
        continue
    rel_big50.append(r(np.percentile(w["rel_error"], 50) * 100, 1))
    rel_big80.append(r(np.percentile(w["rel_error"], 80) * 100, 1))
    n_big.append(units_n)

# "Who wins": at each horizon the party with the highest poll average vs. the party that actually won.
races = {}
for y in sorted({u["year"] for u in units}):
    us = [u for u in units if u["year"] == y]
    ranked = sorted(us, key=lambda u: -u["result"])
    win, second = ranked[0], ranked[1]
    leader, gap = [], []
    for i, h in enumerate(hs):
        vals = sorted(((u["avg"][i], u["party"]) for u in us if u["avg"][i] is not None), reverse=True)
        leader.append(vals[0][1] if vals else None)
        gap.append(r(vals[0][0] - vals[1][0], 1) if len(vals) > 1 else None)
    races[int(y)] = {
        "winner": win["party"], "winnerResult": win["result"], "secondResult": second["result"], "second": second["party"],
        "color": win["color"],
        "leader": leader, "lead": gap,
        "leaderAvg": [next((u["avg"][i] for u in us if u["party"] == leader[i]), None) if leader[i] else None for i in range(len(hs))],
        "winnerAvg": win["avg"],
    }

# ---- Outlook for the next election -------------------------------------------------------------
# Given a party's poll average A at some distance from the election, where did the result R end up?
# Empirical quantiles of R / A over earlier elections (parties polling >= 5 % at that time, so the party
# is selected by what was known then, not by how it finished). No symmetry or distribution assumed.
OUTLOOK_MIN = 5.0
QS = (0.10, 0.25, 0.75, 0.90)
cases = avg[avg["average"] >= OUTLOOK_MIN].assign(ratio=lambda d: d["result"] / d["average"])


def ratio_quantiles(df, h, window=14):
    w = df[(df["horizon"] - h).abs() <= window]
    if w.groupby(["election_year", "party"]).ngroups < 5:
        return None
    return [float(np.quantile(w["ratio"], q)) for q in QS]


# Leave-one-election-out backtest: quantiles from three elections, coverage measured on the fourth.
backtest = []
for h in (364, 182, 91, 28, 7):
    hit50 = hit80 = total = 0
    for y in sorted(cases["election_year"].unique()):
        q = ratio_quantiles(cases[cases["election_year"] != y], h)
        test = cases[(cases["election_year"] == y) & (cases["horizon"] == h)]
        if q is None or test.empty:
            continue
        total += len(test)
        hit50 += int(((test["ratio"] >= q[1]) & (test["ratio"] <= q[2])).sum())
        hit80 += int(((test["ratio"] >= q[0]) & (test["ratio"] <= q[3])).sum())
    backtest.append({"horizon": h, "n": total, "cov50": r(hit50 / total * 100, 0) if total else None,
                     "cov80": r(hit80 / total * 100, 0) if total else None})

# Current poll averages as of the latest poll in the data.
latest = polls["date"].max()
t_now = to_day(latest)
t_elec = to_day(NEXT_ELECTION)
horizon_now = t_elec - t_now
hq = min(hs, key=lambda x: abs(x - horizon_now))
qnow = ratio_quantiles(cases, hq)
recent = prefs[prefs["date"] >= latest - pd.Timedelta(days=120)]
outlook_parties, below = [], []
for p in sorted(recent["party_canonical"].unique()):
    a = PartyPolls(prefs, polls, p).carry_forward(t_now)
    if np.isnan(a) or a < 3.0:
        continue
    if r(a, 1) >= OUTLOOK_MIN and qnow is not None:
        outlook_parties.append({"party": p, "color": colors.get(p, "#888888"), "avg": r(a, 1),
                                "b80": [r(a * qnow[0], 1), r(a * qnow[3], 1)],
                                "b50": [r(a * qnow[1], 1), r(a * qnow[2], 1)]})
    else:
        below.append({"party": p, "avg": r(a, 1)})
outlook_parties.sort(key=lambda x: -x["avg"])
below.sort(key=lambda x: -x["avg"])
wnow = cases[(cases["horizon"] - hq).abs() <= 14]
outlook = {"asOf": str(latest)[:10], "horizon": int(horizon_now), "cases": int(cases.groupby(["election_year", "party"]).ngroups),
           "quantiles": [r(v, 3) for v in qnow] if qnow else None,
           "medianRatio": r(float(np.median(wnow["ratio"])), 2),
           "parties": outlook_parties, "below": below, "backtest": backtest}

data = {
    "nextElection": NEXT_ELECTION,
    "outlook": outlook,
    "horizons": hs,
    "elections": elections,
    "agencies": agencies,
    "mae": series(avg),
    "maeByElection": {int(y): series(g, pooled=False) for y, g in avg.groupby("election_year")},
    "relMedian": [r(v * 100 if v is not None else v, 1) for v in series(avg, "rel_error", "median")],
    "baseline": series(avg, "baseline_abs_error"),
    "relParl50": rel_big50, "relParl80": rel_big80, "nParl": n_big,
    "races": races,
    "n": [int(v) for v in avg.groupby("horizon").size().reindex(hs).fillna(0)],
    "units": sorted(units, key=lambda u: (u["year"], -u["result"])),
}
OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
print(f"{OUT} ({OUT.stat().st_size / 1024:.0f} kB), {len(units)} units")
