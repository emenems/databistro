import pandas as pd


def read_and_prepare_data(file_path: str) -> pd.DataFrame:
    """
    Reads in the Excel file and processes the raw data.
    """
    df = pd.read_excel(file_path, engine="openpyxl", skiprows=4)
    # Remove the second row and rename columns
    df = df.iloc[1:].rename(columns={"Unnamed: 0": "country", "Unnamed: 1": "trade_type"})
    # Drop columns containing " (d).1"
    df = df[[col for col in df.columns if " (d).1" not in col]]
    # Convert columns that have " (d)" to integers (years)
    df = df.rename(columns={col: int(col.split(" (d)")[0]) for col in df.columns if " (d)" in col}, errors="ignore")
    # Clean up numeric values: remove spaces, replace commas with dots, convert dashes to "0"
    for col in df.columns:
        if isinstance(col, int):
            df[col] = df[col].apply(lambda x: str(x).replace(" ", "").replace(",", ".").replace("-", "0"))
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=[col for col in df.columns if isinstance(col, int)], how="any")

    # Convert to long format
    df_long = pd.melt(df, id_vars=["country", "trade_type"], var_name="year", value_name="value")
    # Pivot the DataFrame to get import and export values
    df_pivot = df_long.pivot_table(index=["country", "year"], columns="trade_type", values="value").reset_index()
    df_pivot.columns.name = None  # Remove the pivot column name
    df_pivot = df_pivot.rename(columns={"Dovoz": "import", "Vývoz": "export"})
    df_pivot = df_pivot.assign(difference=df_pivot["export"] - df_pivot["import"])
    return df_pivot


def finalize_data(df_pivot: pd.DataFrame) -> pd.DataFrame:
    """
    Finalizes the pivoted data:
     - Adds a country_id column using convert_to_iso3.
     - Selects and sorts the relevant columns.
     - Filters out rows with an "XXX" country_id except for country "SPOLU".
     - Rounds numeric values.
    """
    df_pivot["country_id"] = convert_to_iso3(df_pivot["country"].tolist())
    df_pivot = df_pivot[["country_id", "country", "year", "import", "export", "difference"]]
    df_pivot = df_pivot.sort_values(by=["year", "difference"], ascending=False).reset_index(drop=True)
    df_pivot = df_pivot[(df_pivot["country_id"] != "XXX") | (df_pivot["country"] == "SPOLU")]
    df_pivot = df_pivot.round(1)
    return df_pivot


# The convert_to_iso3 function remains unchanged.
def convert_to_iso3(country_list):
    # Dictionary mapping Slovak country names to ISO 3166-1 alpha-3 codes
    country_mapping = {
        "Nauru": "NRU",
        "Surinam": "SUR",
        "Burkina Faso": "BFA",
        "Sudán": "SDN",
        "Nešpecifikované členské štáty EÚ": "XXX",
        "Bosna a Hercegovina": "BIH",
        "Iránska islamská republika": "IRN",
        "Maroko": "MAR",
        "Pakistan": "PAK",
        "Portugalsko": "PRT",
        "Svätá Lucia": "LCA",
        "Svätá stolica": "VAT",
        "Svätý Krištof a Nevis": "KNA",
        "Kórejská ľudovodemokratická republika": "PRK",
        "Tanzánijská zjednotená republika": "TZA",
        "ÁZIA": "XXX",
        "Svätá Helena, Ascension, Tristan da Cunha": "SHN",
        "Cookove ostrovy": "COK",
        "Rovníková Guinea": "GNQ",
        "Americké Panenské ostrovy": "VIR",
        "AUSTRÁLIA": "AUS",
        "Bouvetov ostrov": "BVT",
        "Fínsko": "FIN",
        "Konžská demokratická republika": "COD",
        "Nórsko": "NOR",
        "Seychely": "SYC",
        "Somálsko": "SOM",
        "ANTARKTÍDA": "ATA",
        "Mauritánia": "MRT",
        "Belgicko": "BEL",
        "Kostarika": "CRI",
        "Slovensko": "SVK",
        "Wallis a Futuna": "WLF",
        "Kiribati": "KIR",
        "Argentína": "ARG",
        "Ceuta": "XXX",
        "Mexiko": "MEX",
        "Mongolsko": "MNG",
        "Uganda": "UGA",
        "Gruzínsko": "GEO",
        "Samoa": "WSM",
        "Zimbabwe": "ZWE",
        "Afganistan": "AFG",
        "Mozambik": "MOZ",
        "Benin": "BEN",
        "Singapur": "SGP",
        "Čierna Hora": "MNE",
        "Chorvátsko": "HRV",
        "Nemecko": "DEU",
        "Švédsko": "SWE",
        "Brunejsko-darussalamský štát": "BRN",
        "Tuvalu": "TUV",
        "Salvádor": "SLV",
        "Nikaragua": "NIC",
        "Komory": "COM",
        "Tonga": "TON",
        "Aruba": "ABW",
        "Americká Samoa": "ASM",
        "Pitcairnove ostrovy": "PCN",
        "Ostrovy Severné Mariány": "MNP",
        "OECD": "XXX",
        "Holandsko": "NLD",
        "Francúzsko": "FRA",
        "Paraguaj": "PRY",
        "Omán": "OMN",
        "Zambia": "ZMB",
        "Bulharsko": "BGR",
        "Kuba": "CUB",
        "Bolívijský mnohonárodný štát": "BOL",
        "Írsko": "IRL",
        "Mali": "MLI",
        "Spojené arabské emiráty": "ARE",
        "Arménsko": "ARM",
        "Kanada": "CAN",
        "Dominikánska republika": "DOM",
        "Guatemala": "GTM",
        "Kolumbia": "COL",
        "Marshallove ostrovy": "MHL",
        "Slovinsko": "SVN",
        "Venezuelská bolívarovská republika": "VEN",
        "Pobrežie Slonoviny": "CIV",
        "Kambodža": "KHM",
        "Mjanmarsko": "MMR",
        "Cyprus": "CYP",
        "Bangladéš": "BGD",
        "Maďarsko": "HUN",
        "Izrael": "ISR",
        "AFRIKA": "XXX",
        "Palau": "PLW",
        "Tadžikistan": "TJK",
        "Alžírsko": "DZA",
        "Španielsko": "ESP",
        "Turecko": "TUR",
        "Melila": "XXX",
        "Papua-Nová Guinea": "PNG",
        "Lesotho": "LSO",
        "Malajzia": "MYS",
        "Švajčiarsko": "CHE",
        "Grécko": "GRC",
        "Eswatini": "SWZ",
        "Lichtenštajnsko": "LIE",
        "Francúzske južné územia": "ATF",
        "SPOLU": "XXX",
        "Severné Macedónsko": "MKD",
        "Saudská Arábia": "SAU",
        "Fidži": "FJI",
        "Haiti": "HTI",
        "Kirgizsko": "KGZ",
        "Faerské ostrovy": "FRO",
        "Tunisko": "TUN",
        "Dominika": "DMA",
        "EURÓPA": "XXX",
        "Britské panenské ostrovy": "VGB",
        "Grenada": "GRD",
        "EÚ-27B (od 2020)": "XXX",
        "Spojené štáty americké": "USA",
        "Andorra": "AND",
        "AMERIKA": "XXX",
        "Kapverdy": "CPV",
        "Thajsko": "THA",
        "Malta": "MLT",
        "Srí Lanka": "LKA",
        "Gabon": "GAB",
        "Ostrovy Turks a Caicos": "TCA",
        "Guyana": "GUY",
        "Honduras": "HND",
        "Južná Afrika": "ZAF",
        "Libanon": "LBN",
        "Šalamúnove ostrovy": "SLB",
        "Uruguaj": "URY",
        "San Maríno": "SMR",
        "Guinea": "GIN",
        "Kokosové ostrovy": "CCK",
        "Niue": "NIU",
        "Gibraltár": "GIB",
        "Nigéria": "NGA",
        "India": "IND",
        "Ostrov Norfolk": "NFK",
        "Kajmanie ostrovy": "CYM",
        "Grónsko": "GRL",
        "Kazachstan": "KAZ",
        "Maldivy": "MDV",
        "Vietnam": "VNM",
        "Britské indickooceánske územie": "IOT",
        "Stredoafrická republika": "CAF",
        "Maurícius": "MUS",
        "Menšie odľahlé ostrovy Spojených štátov": "UMI",
        "Falklandské ostrovy": "FLK",
        "Botswana": "BWA",
        "Luxembursko": "LUX",
        "Ukrajina": "UKR",
        "Gambia": "GMB",
        "Bahrajn": "BHR",
        "Madagaskar": "MDG",
        "Angola": "AGO",
        "Čína": "CHN",
        "Keňa": "KEN",
        "Heardov ostrov a Mcdonaldove ostrovy": "HMD",
        "Irak": "IRQ",
        "Okupované palestínske územie": "PSE",
        "Guam": "GUM",
        "Srbsko": "SRB",
        "Ruská federácia": "RUS",
        "Brazília": "BRA",
        "Antarktída.": "ATA",
        "Ghana": "GHA",
        "Hongkong": "HKG",
        "Mikronézske federatívne štáty": "FSM",
        "Rwanda": "RWA",
        "Guinea-Bissau": "GNB",
        "Litva": "LTU",
        "Lotyšsko": "LVA",
        "Nešpecifikované štáty a územia": "XXX",
        "Azerbajdžan": "AZE",
        "EÚ-27 (od 2007 do 2013)": "XXX",
        "Anguilla": "AIA",
        "Južná Georgia a Južné Sandwichove ostrovy": "SGS",
        "Antigua a Barbuda": "ATG",
        "Sierra Leone": "SLE",
        "Bielorusko": "BLR",
        "Bhután": "BTN",
        "EZVO": "XXX",
        "Turkménsko": "TKM",
        "Japonsko": "JPN",
        "Panama": "PAN",
        "Ekvádor": "ECU",
        "Estónsko": "EST",
        "Svätý Vincent a Grenadíny": "VCT",
        "Džibutsko": "DJI",
        "Belize": "BLZ",
        "Filipíny": "PHL",
        "Líbya": "LBY",
        "Taliansko": "ITA",
        "Togo": "TGO",
        "Albánsko": "ALB",
        "Dánsko": "DNK",
        "Sýrska arabská republika": "SYR",
        "Egypt": "EGY",
        "Francúzska Polynézia": "PYF",
        "Senegal": "SEN",
        "Nepál": "NPL",
        "Kosovo": "XKX",  # Note: Kosovo uses XKX as a provisional code
        "Eritrea": "ERI",
        "Niger": "NER",
        "Tokelau": "TKL",
        "Island": "ISL",
        "EÚ-28 (od 2013 do 2020)": "XXX",
        "Čile": "CHL",
        "Bahamy": "BHS",
        "Bermudy": "BMU",
        "Kamerun": "CMR",
        "Laoská ľudovodemokratická republika": "LAO",
        "Taiwan": "TWN",
        "Kongo": "COG",
        "OCEÁNIA": "XXX",
        "Malawi": "MWI",
        "Rakúsko": "AUT",
        "Jamajka": "JAM",
        "Peru": "PER",
        "Vanuatu": "VUT",
        "Východný Timor": "TLS",
        "Kórejská republika": "KOR",
        "Kuvajt": "KWT",
        "Namíbia": "NAM",
        "Uzbekistan": "UZB",
        "Jordánsko": "JOR",
        "Poľsko": "POL",
        "Nová Kaledónia": "NCL",
        "Rumunsko": "ROU",
        "Spojené kráľovstvo": "GBR",
        "Katar": "QAT",
        "Austrália.": "AUS",
        "Burundi": "BDI",
        "Trinidad a Tobago": "TTO",
        "Libéria": "LBR",
        "Česko": "CZE",
        "Svätý Tomáš a Princov ostrov": "STP",
        "Vianočný ostrov": "CXR",
        "Macao": "MAC",
        "Saint Pierre a Miquelon": "SPM",
        "Jemen": "YEM",
        "Barbados": "BRB",
        "Indonézia": "IDN",
        "Montserrat": "MSR",
        "Nový Zéland": "NZL",
        "Etiópia": "ETH",
        "Moldavská republika": "MDA",
        "Čad": "TCD",
    }
    return [country_mapping.get(i, "XXX") for i in country_list]


def print_trade_data(df_pivot, year, file_name: str = None, mode: str = "w"):
    """Generates the trade data string and either prints it or writes it to a file.

    Parameters:
      - df_pivot: DataFrame containing the pivoted trade data.
      - year: Year to filter the data.
      - file_name: Optional; path to the output file.
      - mode: "w" to create/overwrite a file or "a" to append.
    """
    df_pivot = df_pivot[df_pivot["year"] == year]
    trade_data = {}
    for _, row in df_pivot.iterrows():
        country_id = row["country_id"]
        if country_id not in trade_data:
            trade_data[country_id] = {"dovoz": 0, "vyvoz": 0}
        trade_data[country_id]["dovoz"] += row["import"]
        trade_data[country_id]["vyvoz"] += row["export"]

    trade_data_str = "\nexport const tradeData: Record<string, { dovoz: number; vyvoz: number }> = {\n"
    for country_id, values in trade_data.items():
        trade_data_str += f"  {country_id}: {{ dovoz: {values['dovoz']}, vyvoz: {values['vyvoz']} }},\n"
    trade_data_str = trade_data_str.rstrip(",\n") + "\n};"

    if file_name:
        with open(file_name, mode, encoding="utf-8") as f:
            f.write(trade_data_str)
    else:
        print(trade_data_str)


def print_yearly(df_pivot, country: str = "SPOLU", file_name: str = None, mode: str = "w"):
    """
    Generates the yearly data string and either prints it or writes it to a file.

    Parameters:
      - df_pivot: DataFrame containing the pivoted trade data.
      - country: Filter for a specific country (default "SPOLU").
      - file_name: Optional; path to the output file.
      - mode: "w" to create/overwrite a file or "a" to append.
    """
    df_pivot = df_pivot[df_pivot["country"] == country].sort_values(by="year", ascending=True)
    yearly_data = []

    for year in df_pivot["year"].unique():
        year_data = df_pivot[df_pivot["year"] == year]
        bilancia = year_data["difference"].sum()
        vyvoz = year_data["export"].sum()
        dovoz = year_data["import"].sum()
        yearly_data.append({"date": year, "Bilancia": bilancia, "Vývoz": vyvoz, "Dovoz": dovoz})

    yearly_data_str = (
        "\n\nexport const data: {date: number, 'Bilancia': number, 'Vývoz': number, 'Dovoz': number}[] = [\n"
    )
    for item in yearly_data:
        yearly_data_str += f"  {{ date: {item['date']}, 'Bilancia': {item['Bilancia']}, 'Vývoz': {item['Vývoz']}, 'Dovoz': {item['Dovoz']} }},\n"
    yearly_data_str = yearly_data_str.rstrip(",\n") + "\n];"

    if file_name:
        with open(file_name, mode, encoding="utf-8") as f:
            f.write(yearly_data_str)
    else:
        print(yearly_data_str)


def print_table(df_pivot, file_name: str = None, mode: str = "w"):
    output = "\n\nexport const dataTable = [\n"
    for i, row in df_pivot.iterrows():
        output += f"  {{ id: {i}, country: '{row['country']}', year: {row['year']}, dovoz: {row['import']}, vyvoz: {row['export']}, bilancia: {row['difference']} }},\n"
    output += "];"

    if file_name:
        with open(file_name, mode, encoding="utf-8") as f:
            f.write(output)
    else:
        print(output)


# Example usage:
def read_and_prepare_data(file_path: str) -> pd.DataFrame:
    """
    Reads and processes the Excel file and returns the pivoted DataFrame.
    """
    df = pd.read_excel(file_path, engine="openpyxl", skiprows=4)
    # remove the second row
    df = df.iloc[1:].rename(columns={"Unnamed: 0": "country", "Unnamed: 1": "trade_type"})
    # drop columns with " (d).1" in name
    df = df[[col for col in df.columns if " (d).1" not in col]]
    # convert columns to years
    df = df.rename(columns={col: int(col.split(" (d)")[0]) for col in df.columns if " (d)" in col}, errors="ignore")
    # now convert to normal number = remove space and use ',' as decimal for all year columns
    for col in df.columns:
        if isinstance(col, int):
            df[col] = df[col].apply(lambda x: str(x).replace(" ", "").replace(",", ".").replace("-", "0"))
            df[col] = pd.to_numeric(df[col], errors="coerce")
    df = df.dropna(subset=[col for col in df.columns if isinstance(col, int)], how="any")

    # Convert to long format
    df_long = pd.melt(df, id_vars=["country", "trade_type"], var_name="year", value_name="value")

    # Pivot the DataFrame to get import and export values
    df_pivot = df_long.pivot_table(index=["country", "year"], columns="trade_type", values="value").reset_index()
    df_pivot.columns.name = None
    df_pivot = df_pivot.rename(columns={"Dovoz": "import", "Vývoz": "export"})
    df_pivot = df_pivot.assign(difference=df_pivot["export"] - df_pivot["import"])
    return df_pivot


def finalize_data(df_pivot: pd.DataFrame) -> pd.DataFrame:
    """
    Finalizes the pivoted data:
      - Adds a country_id column using convert_to_iso3.
      - Selects and sorts the relevant columns.
      - Filters out rows with an "XXX" country_id (except for country "SPOLU").
      - Rounds numeric values.
    """
    df_pivot["country_id"] = convert_to_iso3(df_pivot["country"].tolist())
    df_pivot = df_pivot[["country_id", "country", "year", "import", "export", "difference"]]
    df_pivot = df_pivot.sort_values(by=["year", "difference"], ascending=False).reset_index(drop=True)
    df_pivot = df_pivot[(df_pivot["country_id"] != "XXX") | (df_pivot["country"] == "SPOLU")]
    df_pivot = df_pivot.round(1)
    return df_pivot


def print_summary(df_pivot, file_name: str = None, mode: str = "w"):
    temp = df_pivot[(df_pivot["country"] == "SPOLU") & (df_pivot["year"] == df_pivot["year"].max())]
    output = "\n\nexport const summaryData = [\n"
    output += "    { name: 'Bilancia', value: " + f"{temp['difference'].values[0]}" + " },\n"
    output += "    { name: 'Vývoz', value: " + f"{temp['export'].values[0]}" + " },\n"
    output += "    { name: 'Dovoz', value: " + f"{temp['import'].values[0]}" + " }\n"
    output += "];"

    if file_name:
        with open(file_name, mode, encoding="utf-8") as f:
            f.write(output)
    else:
        print(output)


# Process and print/export the data
if __name__ == "__main__":
    file_path = "./api/tradesk/v_zo0004rs_00_00_00_sk20250306074521.xlsx"
    df_pivot = read_and_prepare_data(file_path)
    df_pivot = finalize_data(df_pivot)

    # Write outputs to file "trade_data.ts" (overwrite then append for each)
    print_trade_data(df_pivot, df_pivot["year"].max(), "tradedata.ts", "w")
    print_yearly(df_pivot, "SPOLU", "tradedata.ts", "a")
    print_table(df_pivot, "tradedata.ts", "a")
    print_summary(df_pivot, "tradedata.ts", "a")
