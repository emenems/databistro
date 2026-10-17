"""Exports the demography datasets to JSON for the Next.js frontend.

The frontend prerenders the demography post, so it reads these snapshots
directly instead of calling the FastAPI backend at build time.

Run from the repository root:
    python3 -m api.demography.export_json
"""

import json
from pathlib import Path

from api.demography.utils import (
    get_demography_age,
    get_demography_age_median,
    get_demography_sum,
)

OUTPUT_DIR = Path("src/data/demography")
COLUMNS = ["geo", "full_name", "year", "value", "eu", "ce"]
AGE_COLUMNS = ["geo", "full_name", "year", "value", "age_from", "age_to", "eu", "ce"]


def export(name: str, data, columns: list) -> None:
    records = data[columns].sort_values(columns[:3]).to_dict(orient="records")
    path = OUTPUT_DIR / f"{name}.json"
    path.write_text(json.dumps(records, ensure_ascii=False, separators=(",", ":")))
    print(f"{path}: {len(records)} rows")


if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    export("sum", get_demography_sum(), COLUMNS)
    export("age", get_demography_age(), AGE_COLUMNS)
    export("age_median", get_demography_age_median(), COLUMNS)
