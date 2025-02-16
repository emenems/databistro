from functools import lru_cache
import pandas as pd

@lru_cache(maxsize=1)
def load_data_electric():
    df = pd.read_excel('api/data/interim/data_table_elektroauta.xlsx')
    df['registracia_aux'] = pd.to_datetime(df['registracia'])
    df['model'] = df['model'].astype(str)
    return df

@lru_cache(maxsize=1)
def load_data_monthly_all():
    df = pd.read_excel('api/data/interim/data_table_monthly_registrations.xlsx')
    de = prep_data_monthly_electric()
    de = de.rename(columns={f"{col}": f"{col}_elektro" for col in de.columns if col not in ['year', 'month']})
    out = df.rename(columns={"registrations":"pocet_vsetky"}).merge(de, on=['year', 'month'], how='left')
    out = out.assign(pocet_neelektro=out['pocet_vsetky'] - out['pocet_elektro'])
    return out

@lru_cache(maxsize=1)
def monthly_to_yearly_all():
    df = load_data_monthly_all()
    out = df.groupby('year').agg(
        pocet_vsetky=('pocet_vsetky', 'sum'),
        pocet_elektro=('pocet_elektro', 'sum'),
        pocet_neelektro=('pocet_neelektro', 'sum'),
        hmotnost_elektro=('hmotnost_elektro', 'mean'),
        vykon_elektro=('vykon_elektro', 'mean')
    ).reset_index()
    out['hmotnost_elektro'] = out['hmotnost_elektro'].round(0).astype(int)
    out['vykon_elektro'] = out['vykon_elektro'].round(0).astype(int)
    return out

@lru_cache(maxsize=1)
def prep_data_monthly_electric():
    df = load_data_electric()
    temp = df[['registracia_aux', 'hmotnost', 'vykon', 'znacka', 'model', 'pracovisko']]
    temp = temp.assign(year=temp['registracia_aux'].dt.year)
    temp = temp.assign(month=temp['registracia_aux'].dt.month)

    de = temp.drop(columns='registracia_aux').groupby(by=['year', 'month']).agg(
        vykon=('vykon', 'mean'),
        hmotnost=('hmotnost', 'mean'),
        pocet=('hmotnost', 'count')
    ).reset_index()
    de['vykon'] = de['vykon'].round(0).astype(int)
    de['hmotnost'] = de['hmotnost'].round(0).astype(int)
    return de

@lru_cache(maxsize=1)
def prep_data_yearly_electric():
    df = prep_data_monthly_electric()
    de = df.groupby('year').agg(
        vykon=('vykon', 'mean'),
        hmotnost=('hmotnost', 'mean'),
        pocet=('pocet', 'sum')
    ).reset_index()
    de['vykon'] = de['vykon'].round(0).astype(int)
    de['hmotnost'] = de['hmotnost'].round(0).astype(int)
    return de

@lru_cache(maxsize=128)
def filter_data_electric(year: int = None, znacka: str = None, model: str = None, pracovisko: str = None):
    de = load_data_electric()
    if year:
        de = de[de['registracia_aux'].dt.year == year]
    if znacka:
        de = de[de['znacka'] == znacka]
    if model:
        de = de[de['model'] == model]
    if pracovisko:
        de = de[de['pracovisko'] == pracovisko]
    de = de.drop(columns=['registracia_aux'])
    return de.to_dict(orient='records')

@lru_cache(maxsize=8)
def aggraget_data_electric(year: int, groupby: str):
    de = load_data_electric()
    de = de[de['registracia_aux'].dt.year == year]
    out = de.groupby(groupby).agg(
        pocet=(groupby, 'count'),
    ).reset_index()
    out = out.sort_values(by='pocet', ascending=False)
    out['podiel'] = (out['pocet'] / out['pocet'].sum()).mul(100).round(1)
    out = out.sort_values(by='podiel', ascending=False)
    if groupby == 'model':
        out['model'] = out['model'].astype(str)
        out = pd.merge(out, de[['model', 'znacka']].drop_duplicates(), on='model', how='left')
    return out
