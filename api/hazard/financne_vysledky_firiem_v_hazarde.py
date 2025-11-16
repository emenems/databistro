# Copyright 2024 Marimo. All rights reserved.

import marimo

app = marimo.App()


@app.cell
def _():
    import os
    import marimo as mo
    import pandas as pd
    import numpy as np
    from bs4 import BeautifulSoup
    import warnings
    import requests
    from datetime import datetime
    import altair as alt
    import matplotlib.pyplot as plt
    import matplotlib.patches as patches

    warnings.simplefilter("ignore")
    return (
        BeautifulSoup,
        alt,
        datetime,
        mo,
        np,
        os,
        patches,
        pd,
        plt,
        re,
        requests,
    )


@app.cell
def _(mo):
    mo.center(
        mo.md(
            r"""
    # Finančné výsledky firiem v hazarde
    """
        )
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    Analýza finančných výsledkov firiem podnikajúcich v hazarde na Slovensku: Najziskovejšou spoločnosťou je už dlhodobo TIPSPORT, zatiaľ čo najväčšie tržby má štátny TIPOS. Spoločnosti s licenciou na stávkové (kurzové) hry generujú drvivú väčšinu zisku. Z celkového počtu 33 spoločností bolo v roku 2024 v zisku 25. V roku 2020 to bolo len 12 spoločností so ziskom.
    <br>
    <br>
    """
    )
    return


@app.cell
def _():
    inputs = {
        "kody": "./api/hazard/data/Kód druhu hazardnej hry_2024.xlsx",
        "crp": "./api/hazard/data/CRP.xlsx",
        "licencie": "./api/hazard/data/Zoznam udelených individuálnych licencií.xlsx",
        "finstat": "./api/hazard/data/finstat_series.xlsx",
    }
    urls = {
        "kody": "https://www.urhh.sk/web/guest/%C4%8D%C3%ADseln%C3%ADk-druhov-hazardn%C3%BDch-hier",
        "crp": "https://www.urhh.sk/documents/20127/531778/CRP.xlsx/1cda6bd8-7c93-5f00-c832-2832e13ac6ed?t=1761955046136",
        "licencie": "https://www.urhh.sk/documents/20127/531773/Zoznam+udelen%C3%BDch+individu%C3%A1lnych+licenci%C3%AD.xlsx/8076a4fa-11bb-8c52-50f1-c82af116e088?t=1761955086947",
        "finstat": "https://finstat.sk/",
        "valida": "https://valida.sk/",
    }
    return inputs, urls


@app.cell
def _(requests):
    def download_file(url: str, download_to: str) -> None:
        response = requests.get(url, verify=False)
        if response.status_code == 200:
            with open(download_to, "wb") as file:
                file.write(response.content)

    return (download_file,)


@app.cell
def _(inputs, os, pd):
    if not os.path.isfile(inputs["kody"]):
        raise FileNotFoundError(f"Je nutné stiahnuť {inputs['kody'].replace('xlsx', 'pdf')} a konvertovať do xlsx")

    kody = pd.read_excel(inputs["kody"])
    kody = kody.sort_values(by="Kód hazardnej hry").drop_duplicates()
    return (kody,)


@app.cell
def _(download_file, inputs, os, pd, urls):
    if not os.path.isfile(inputs["crp"]):
        download_file(urls["crp"], inputs["crp"])
    crp = pd.read_excel(inputs["crp"], engine="openpyxl", skiprows=2, dtype={"IČO": str, "PSČ": str})
    crp["IČO"] = crp["IČO"].apply(lambda x: f"{int(x):08d}")
    # crp
    return (crp,)


@app.cell
def _(crp, download_file, inputs, os, pd, urls):
    if not os.path.isfile(inputs["licencie"]):
        download_file(urls["licencie"], inputs["licencie"])

    licencie = pd.read_excel(inputs["licencie"], engine="openpyxl", skiprows=2, dtype={"IČO": str})
    licencie = pd.merge(
        licencie,
        crp.drop(columns=["Názov prevádzkovateľa", "Číslo prevádzkovateľa"]),
        on="IČO",
    )
    licencie = (
        licencie.drop_duplicates(subset=["IČO", "Kód hazardnej hry"])
        .groupby("IČO")
        .agg(
            {
                "P.č.": "first",
                "Názov spoločnosti": "first",
                "Obdobie platnosti (od)": "min",
                "Obdobie platnosti (do)": "max",
                "Názov hazardnej hry": lambda x: ",".join(x.dropna().unique()),
                "Kód hazardnej hry": lambda x: ",".join(x.dropna().unique()),
                "Druh hazardnej hry": lambda x: "; ".join(x.dropna().unique()),
                "Sídlo": "first",
                "Orientačné číslo": "first",
                "Súpisné číslo": "first",
                "PSČ": "first",
                "Obec": "first",
                "Dátum zaradenia": "first",
            }
        )
        .reset_index(drop=False)
    )
    # licencie
    return (licencie,)


@app.cell
def _(pd):
    def add_profit_income_ratio(df: pd.DataFrame) -> pd.DataFrame:
        """Adds new rows with Druh Zisk/Tržby (%)"""
        output = pd.merge(
            df[df.Druh == "Zisk"].rename(columns={"Hodnota": "Zisk"}),
            df[df.Druh == "Tržby"][["Rok", "IČO", "Hodnota"]].rename(columns={"Hodnota": "Tržby"}),
            on=["Rok", "IČO"],
            validate="1:1",
        )
        output.Druh = "Zisk/Tržby (%)"
        output = output.assign(Hodnota=output["Zisk"].div(output["Tržby"]).multiply(100))
        output = output.drop(columns=["Zisk", "Tržby"])
        return pd.concat([df, output], ignore_index=True).reset_index()

    return (add_profit_income_ratio,)


@app.cell
def _(BeautifulSoup, pd, re, requests):
    def get_finsat_series(ico: str) -> pd.DataFrame:
        """Get Zisk, Trzby series form finstat

        Args:
            ico (str): company IČO as string with 8 digits

        Returns:
            pd.DataFrame with year, type, and value columns (in slovak)
        """
        print(f"Processing {ico}")
        url = f"https://finstat.sk/{ico}"
        output = pd.DataFrame(columns=["Rok", "Druh", "Hodnota"])

        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, "html.parser")
        except Exception as e:
            print(f"Error occured for {ico}")
            return output

        for key in ["Zisk", "Tržby"]:
            for tag in soup.find_all("script", type="text/javascript"):
                if tag.string:
                    script_content = tag.string.strip()
                    title_pattern = rf"title\s*:\s*'{re.escape(key)}'"
                    title_match = re.search(title_pattern, script_content)
                    cleaned_string = re.sub(r"(\d{4}) \[[^\]]+\]", r"\1", script_content)
                    if title_match:
                        cat_match = re.search(
                            r"categories\s*:\s*\[([^\]]+)\]",
                            script_content,
                            re.DOTALL,
                        )
                        ser_match = re.search(r"series\s*:\s*\[([^\]]+)\]", script_content, re.DOTALL)
                        if cat_match and ser_match:
                            if "[" in cat_match.group(1).strip():
                                cat_match = re.search(
                                    r"categories\s*:\s*\[([^\]]+)\]",
                                    cleaned_string,
                                    re.DOTALL,
                                )

                            years = [
                                year.strip().strip("\"'").split(" ")[0]
                                for year in re.split(r",(?![^\[]*\])", cat_match.group(1))
                            ]
                            series = [
                                {
                                    "name": key,
                                    "data": [{"y": val} for val in re.findall(r'{"y":(-?\d+)}', ser_match.group(1))],
                                }
                            ]
                            values = [i["y"] for i in series[0]["data"]]
                            if len(years) != len(values):
                                print(f"Warning: unequal data length for {ico}")
                                years = [years[-1]]
                                values = [values[-1]]
                            output = pd.concat(
                                [
                                    output,
                                    pd.DataFrame(
                                        {
                                            "Rok": years,
                                            "Druh": key,
                                            "Hodnota": values,
                                        }
                                    ),
                                ]
                            )
                            break
        return output.assign(IČO=ico)

    return (get_finsat_series,)


@app.cell
def _(get_finsat_series, inputs, licencie, os, pd):
    if os.path.isfile(inputs["finstat"]):
        series = pd.read_excel(inputs["finstat"], dtype={"IČO": str})
        series = series[[i for i in series.columns if "Unnamed" not in i]]
        series["IČO"] = series["IČO"].apply(lambda x: f"{int(x):08d}")
    else:
        series = pd.DataFrame()
        for ico in licencie["IČO"].unique():
            ico_series = get_finsat_series(ico)
            series = pd.concat([series, ico_series], ignore_index=True)
        series["IČO"] = series["IČO"].apply(lambda x: f"{int(x):08d}")
        series["Hodnota"] = series["Hodnota"].astype(float)
        series.to_excel(inputs["finstat"], index=False)
    # series
    return (series,)


@app.cell
def _(pd):
    def fix_values(df: pd.DataFrame) -> pd.DataFrame:
        """Fix incorrect values in the inputs"""
        # bug in finstat for https://finstat.sk/54115060
        mask = (df["IČO"] == "54115060") & (df["Druh"] == "Tržby")
        output = df.copy()
        output["Hodnota"] = output["Hodnota"].mask(mask, output["Hodnota"] * 1000)
        return output

    return (fix_values,)


@app.cell
def _(add_profit_income_ratio, fix_values, licencie, pd, series):
    df = pd.merge(series, licencie, on="IČO", how="left")
    df = fix_values(df)
    df = add_profit_income_ratio(df)
    return (df,)


@app.cell
def _(df, kody, mo):
    # rok = mo.ui.slider.from_series(df.Rok.drop_duplicates().astype(str), value=2024)
    rok = mo.ui.dropdown(
        options=df.Rok.drop_duplicates().astype(str),
        value=2024,
        # label="Zvolený rok ",
    )
    kod_hry = mo.ui.slider(value=60, steps=kody["Kód hazardnej hry"].values, label="Kód")
    kod_typ = mo.ui.radio(
        options=[
            "bez ohľadu na druh hry",
            "na jeden druh hry",
            "na jeden a viac hier",
        ],
        value="bez ohľadu na druh hry",
        inline=True,
        label="Firmy: ",
    )
    # druh = mo.ui.radio(options=["Zisk", "Tržby"], value="Zisk", inline=True)
    druh = mo.ui.dropdown(options={"Zisku": "Zisk", "Tržieb": "Tržby"}, value="Zisku")
    spolocnost = mo.ui.dropdown(
        options=list(df.sort_values(by=["Názov spoločnosti"])["Názov spoločnosti"].unique()),
        label="Zvýrazniť spoločnosť:",
    )
    return druh, kod_hry, kod_typ, rok, spolocnost


@app.cell
def _():
    # mo.center(druh)
    return


@app.cell
def _(alt):
    def bar_chart(
        df,
        xlabel="Názov spoločnosti",
        ylabel="Hodnota",
        divide: int = 1,
        red_color: str = "",
    ):
        """Plot barchart"""
        plot_df = df.copy()

        if divide > 1:
            plot_df.Hodnota = plot_df.Hodnota / divide

        plot_df = plot_df.rename(columns={"Hodnota": ylabel})

        _chart = (
            alt.Chart(plot_df)
            .mark_bar()
            .encode(
                x=alt.X(field="Názov spoločnosti", type="nominal", sort=None),
                y=alt.Y(field=ylabel, type="quantitative"),
                tooltip=[
                    alt.Tooltip(field="Názov spoločnosti"),
                    alt.Tooltip(field=ylabel, format=",.0f"),
                ],
                color=alt.condition(
                    alt.datum["Názov spoločnosti"] == red_color,  # condition for specific bar
                    alt.value("red"),  # color if true
                    alt.value("steelblue"),  # default color for others
                ),
            )
            .properties(height=290, width="container", config={"axis": {"grid": False}})
        )
        return _chart

    return (bar_chart,)


@app.cell
def _(pd):
    def filter_company(
        df: pd.DataFrame,
        year: int,
        code: int,
        code_type: str,
        druh: str,
        sort_by_value: bool = True,
        inverse_code: bool = False,
    ):
        output = df[df.Druh == druh]
        if year is not None:
            output = output[output.Rok == int(year)]

        if code_type == "na jeden druh hry":
            if inverse_code:
                output = output[output["Kód hazardnej hry"] != str(code)]
            else:
                output = output[output["Kód hazardnej hry"] == str(code)]
        elif code_type == "na jeden a viac hier":
            if inverse_code:
                output = output[~output["Kód hazardnej hry"].str.contains(str(code))]
            else:
                output = output[output["Kód hazardnej hry"].str.contains(str(code))]
        if sort_by_value:
            output = output.sort_values(by="Hodnota")
        return output

    return (filter_company,)


@app.cell
def _(druh, mo):
    # mo.center(
    #     mo.md(f"""
    # ## Najvačšie spoločnosti podľa {"zisku" if druh.value == "Zisk" else "tržieb"}
    # """)
    # )
    mo.center(
        mo.hstack(
            [
                mo.md(f"## Najvačšie spoločnosti podľa "),
                druh,
            ],
            justify="center",
        )
    )
    return


@app.cell
def _(alt, df, druh, filter_company, kod_hry, kod_typ):
    x_plot = filter_company(df, None, kod_hry.value, kod_typ.value, druh.value, True, False)
    x_plot["Rank"] = x_plot.groupby("Rok")["Hodnota"].rank(method="min").astype(int)

    top_per_year = x_plot.groupby("Rok").apply(lambda x: x.nlargest(5, "Hodnota")).reset_index(drop=True)
    chart = (
        alt.Chart(top_per_year)
        .mark_line(point=True)
        .encode(
            x=alt.X("Rok:O").title("Rok"),
            y=alt.Y("rank:O").title("Poradie"),
            color=alt.Color("Názov spoločnosti:N", title="Spoločnosť", sort="descending"),
        )
        .transform_window(
            rank="rank()",
            sort=[alt.SortField("Hodnota", order="descending")],
            groupby=["Rok"],
        )
        .properties(
            # title=f"Poradie najvačších spoločností podľa {'zisku' if druh.value == 'Zisk' else 'tržieb'}",
            width="container",
            height=250,
        )
    )

    chart
    return (x_plot,)


@app.cell
def _(mo):
    mo.md(
        r"""
    <br>
    """
    )
    return


@app.cell
def _(druh, mo, rok):
    mo.center(
        mo.hstack(
            [
                mo.md(f"## Spoločnosti podľa **{'zisku' if druh.value == 'Zisk' else 'tržieb'}** v roku"),
                rok,
            ],
            justify="center",
        )
    )
    return


@app.cell
def _(df, druh, filter_company, kod_hry, kod_typ, rok):
    # mo.ui.table(
    #     data=filter_company(
    #         df, rok.value, kod_hry.value, kod_typ.value, druh.value, True
    #     ).sort_values(by=["Hodnota"],ascending=False)
    #     .reset_index(drop=True)[["Názov spoločnosti", "Hodnota", "IČO","Obec"]]
    #     .rename(columns={"Hodnota": druh.value})
    # )
    rank_df = (
        filter_company(df, rok.value, kod_hry.value, kod_typ.value, druh.value, True)
        .sort_values(by=["Hodnota"], ascending=False)
        .reset_index(drop=True)[["Názov spoločnosti", "Hodnota", "IČO", "Obec"]]
        .rename(columns={"Hodnota": druh.value})
    )
    return (rank_df,)


@app.cell
def _(druh, np, patches, plt, rank_df):
    plot_df = rank_df.reset_index().rename(columns={"index": "Rank"})
    plot_df.Rank = plot_df.Rank.add(1)
    plot_df = plot_df

    colors = plt.cm.tab20(np.linspace(0, 1, len(plot_df)))
    colors[1] = [1.0, 0.647, 0.0, 1.0]  # orange
    colors[2] = [1.0, 1.0, 0.0, 1.0]  # yellow
    colors[4:] = [[0.2, 0.2, 0.2, 1.0]] * (len(colors) - 4)

    plot_data = []
    for i, row in plot_df.iterrows():
        color = colors[i]
        angle_offset = 0  # Will override with group-specific angles
        plot_data.append(
            [
                row["Názov spoločnosti"],
                row[druh.value],
                row["Rank"],
                color,
                angle_offset,
            ]
        )

    # Extract central (top rank) and surrounding
    central = plot_data[0]
    surrounding = plot_data[1:]

    # Group surrounding
    group1 = surrounding[:4]
    group2 = surrounding[4:]

    fig, ax = plt.subplots(figsize=(14, 12), subplot_kw=dict(aspect="equal"))  #
    ax.set_xlim(-10, 14)
    ax.set_ylim(-8, 8)
    ax.set_facecolor("#f0f0f0")

    # Radius calculation: Scale bubble sizes proportionally (max radius for largest value)
    max_value = max(d[1] for d in plot_data)
    scale = 4.0  # Adjust for visual size

    # Draw central circle (unchanged)
    central_radius = central[1] / max_value * scale
    central_circle = patches.Circle((0, 0), central_radius, color=central[3], alpha=0.8)
    ax.add_patch(central_circle)

    # Format value as millions (e.g., 92.1M)
    central_value_formatted = f"{central[1] / 1e6:.1f}M"
    ax.text(
        0,
        0,
        f"{central[0]}\n{central_value_formatted}\n#{central[2]}",
        ha="center",
        va="center",
        fontsize=12,
        fontweight="bold",
        color="white",
    )

    # Common radius_outer for all (place groups on the right side)
    radius_outer = central_radius + 2.5  # Increased for better spacing on right

    # Function to draw group bubbles
    def draw_group_bubbles(group, start_angle_deg, end_angle_deg, label_fontsize=8):
        n = len(group)
        if n == 0:
            return
        angles_deg = np.linspace(start_angle_deg, end_angle_deg, n)
        for i, (label, value, rank, color, _) in enumerate(group):
            angle_deg = angles_deg[i]
            angle_rad = np.radians(angle_deg)
            x = radius_outer * np.cos(angle_rad)
            y = radius_outer * np.sin(angle_rad)

            bubble_radius = value / max_value * scale * 1.0  # Full proportional scale
            circle = patches.Circle((x, y), bubble_radius, color=color, alpha=0.8)
            ax.add_patch(circle)

            # Format value as millions
            value_formatted = f"{value / 1e6:.1f}M"
            # Label: Názov spoločnosti, value, rank
            ax.text(
                x,
                y + bubble_radius + 0.15,
                f"{label}\n{value_formatted}",
                ha="center",
                va="bottom",
                fontsize=label_fontsize,
                fontweight="bold",
            )

    draw_group_bubbles(group1, 0, 90, label_fontsize=9)

    draw_group_bubbles(group2, 100, 320, label_fontsize=7)

    plt.axis("off")

    plt.tight_layout()
    plt.gca()
    return


@app.cell
def _(rank_df):
    rank_df
    return


@app.cell
def _(mo, spolocnost):
    mo.center(spolocnost)
    return


@app.cell
def _(bar_chart, df, druh, filter_company, kod_hry, kod_typ, rok, spolocnost):
    bar_chart(
        filter_company(df, rok.value, kod_hry.value, kod_typ.value, druh.value, True),
        ylabel=f"{druh.value} (mil €)",
        divide=1000000,
        red_color=spolocnost.value,
    )
    return


@app.cell
def _(mo):
    mo.md(
        """
    <br>
    """
    )
    return


@app.cell
def _(mo, rok):
    mo.center(mo.md(f"## **Zisk vs Tržby** (%) v roku {rok.value}"))
    return


@app.cell
def _(bar_chart, df, filter_company, kod_hry, kod_typ, rok, spolocnost):
    bar_chart(
        filter_company(df, rok.value, kod_hry.value, kod_typ.value, "Zisk/Tržby (%)", True),
        ylabel="Zisk/Tržby (%)",
        red_color=spolocnost.value,
    )
    return


@app.cell
def _(mo):
    mo.md(
        r"""
    <br>
    """
    )
    return


@app.cell
def _(druh, mo):
    mo.center(mo.md(f"## {druh.value} v priebehu rokov"))
    return


@app.cell
def _(druh, plt, spolocnost, x_plot):
    y_plot = x_plot[["Rok", "Hodnota", "Názov spoločnosti"]]
    y_plot.sort_values(by=["Názov spoločnosti", "Rok"], ascending=True).rename(
        columns={"Rok": "Year", "Hodnota": "Value", "Názov spoločnosti": "Company"}
    ).head(20)
    y_plot.Hodnota = y_plot.Hodnota.div(1000000)

    median_df = y_plot.groupby("Rok")["Hodnota"].median().reset_index()

    # Pivot for easy plotting (companies as columns)
    pivot_df = y_plot.pivot(index="Rok", columns="Názov spoločnosti", values="Hodnota")

    # Create the plot
    plt.figure(figsize=(10, 5))
    years = sorted(y_plot["Rok"].unique())  # Ensure years are in order: [2020, 2021, 2022, 2023, 2024]

    # Plot all company lines in light gray
    for company in pivot_df.columns:
        if company != spolocnost.value:  # Skip Ariola for now
            plt.plot(
                years,
                pivot_df[company].reindex(years, fill_value=None),
                color="lightgray",
                alpha=0.9,
                linewidth=1,
                label=None,
            )  #

    # Highlight Ariola in red
    if spolocnost.value in pivot_df.columns:
        ariola_data = pivot_df[spolocnost.value].reindex(years, fill_value=None)
        plt.plot(years, ariola_data, color="red", linewidth=2.5, label=spolocnost.value)

    # Plot median in blue
    plt.plot(
        median_df["Rok"],
        median_df["Hodnota"],
        color="blue",
        linewidth=2,
        label=f"{druh.value} - median",
    )

    plt.plot(
        [],
        [],
        color="lightgray",
        alpha=0.9,
        linewidth=2.5,
        label="Jednotlivé spoločnosti",
    )

    # plt.rcParams.update({'font.size': 12})
    plt.xlabel("Rok")
    plt.ylabel(
        f"{druh.value} (mil €)",
    )
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.xticks(years)
    plt.tight_layout()
    plt.gca()
    return


@app.cell
def _(mo):
    mo.center(
        mo.md(
            """<br>
    ## Podľa licencie - Stávkové hry vs Bez stávok
    """
        )
    )
    return


@app.cell
def _(mo):
    mo.md(
        """
    > \*Spoločnosti s licenciou na stávkové hry majú licenciu aj na iné druhy hier.
    > *\*Do skupiny spoločností bez stávok sú zahrnuté všetky zostávajúce spoločnosti, t.j. spoločnosti bez licencie na 'Stávkové hry / kurzové stávky v herni, prevádzkach a internetovej herni'.
    """
    )
    return


@app.cell
def _(alt, df, druh, filter_company, mo, pd, rok):
    bet_company = filter_company(df, rok.value, 43, "na jeden a viac hier", druh.value, True, False)
    non_bet_company = filter_company(
        df[~df["IČO"].isin(bet_company["IČO"].unique())],
        rok.value,
        43,
        "bez ohľadu na druh hry",
        druh.value,
        True,
    )
    bet_company = bet_company.assign(Licencia="Stávkové hry / kurzové stávky v herni, prevádzkach a internetovej herni")
    non_bet_company = non_bet_company.assign(Licencia="Bez")
    bet_chart = (
        alt.Chart(pd.concat([bet_company, non_bet_company]))
        .mark_arc()
        .encode(
            theta="Hodnota",
            color=alt.Color("Licencia", sort="descending", legend=alt.Legend(labelFontSize=16)),
        )
        .properties(height=150, width=150, config={"axis": {"grid": False}})
    )
    mo.hstack(
        [
            bet_chart,
            mo.md(
                f""" 
    Sátvkové hry: {bet_company.Hodnota.sum() / 1000000:.1f} mil €   
    Nestávkové hry: {non_bet_company.Hodnota.sum() / 1000000:.1f} mil €  
    Celkovo {druh.value}: {(bet_company.Hodnota.sum() + bet_company.Hodnota.sum()) / 1000000:.1f} mil €
    """
            ),
        ],
        justify="start",
    )
    return


@app.cell(hide_code=True)
def _(datetime, inputs, mo, os, urls):
    mo.md(
        f"""
    ## Vstupné dáta

    - [Zoznam udelených individuálnych licencií]({urls["licencie"]})
    - [Centrálny register prevádzkovateľov hazardných hier (CRP)]({urls["crp"]})
    - [Číselník druhov hazardných hier]({urls["kody"]}) (manálna konverzia do xlsx)
    - [Finstat]({urls["finstat"]})

    > Stiahnuté k {datetime.fromtimestamp(os.path.getctime(inputs["finstat"])).strftime("%d.%m.%Y")}
    """
    )
    return


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
