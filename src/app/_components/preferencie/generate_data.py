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
from preferencie.paths import PROCESSED_DIR  # noqa: E402

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

data = {
    "horizons": hs,
    "elections": elections,
    "agencies": agencies,
    "mae": series(avg),
    "maeByElection": {int(y): series(g, pooled=False) for y, g in avg.groupby("election_year")},
    "relMedian": [r(v * 100 if v is not None else v, 1) for v in series(avg, "rel_error", "median")],
    "baseline": series(avg, "baseline_abs_error"),
    "n": [int(v) for v in avg.groupby("horizon").size().reindex(hs).fillna(0)],
    "units": sorted(units, key=lambda u: (u["year"], -u["result"])),
}
OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
print(f"{OUT} ({OUT.stat().st_size / 1024:.0f} kB), {len(units)} units")
