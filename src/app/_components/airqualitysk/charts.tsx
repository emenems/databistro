'use client';

import { useState } from 'react';

import {
	BarList,
	Card,
	Tab,
	TabGroup,
	TabPanel,
	TabPanels,
	TabList,
	DeltaBar,
	SearchSelect,
	SearchSelectItem
} from '@tremor/react';

const data = [
	{
		'id': '0',
		'city': 'Banská Bystrica',
		'region': 'Banskobystrický kraj',
		'street': 'Štefánik. nábr.',
		'NO2': '24.0',
		'PM10': '26.0',
		'PM25': '16.0',
		'CO': '1644.0',
		'Benzen': '0.94'
	},
	{
		'id': '1',
		'city': 'Banská Bystrica',
		'region': 'Banskobystrický kraj',
		'street': 'Zelená',
		'NO2': '8.0',
		'PM10': '19.0',
		'PM25': '12.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '2',
		'city': 'Jelšava',
		'region': 'Banskobystrický kraj',
		'street': 'Jesenského',
		'NO2': '8.0',
		'PM10': '30.0',
		'PM25': '22.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '3',
		'city': 'Hnúšťa',
		'region': 'Banskobystrický kraj',
		'street': 'Hlavná',
		'NO2': '',
		'PM10': '21.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '4',
		'city': 'Lučenec',
		'region': 'Banskobystrický kraj',
		'street': 'Gemerská cesta',
		'NO2': '15.0',
		'PM10': '24.0',
		'PM25': '17.0',
		'CO': '1494.0',
		'Benzen': '0.74'
	},
	{
		'id': '5',
		'city': 'Zvolen',
		'region': 'Banskobystrický kraj',
		'street': 'J.Alexyho',
		'NO2': '',
		'PM10': '19.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '6',
		'city': 'Žarnovica',
		'region': 'Banskobystrický kraj',
		'street': 'Dolná',
		'NO2': '11.0',
		'PM10': '25.0',
		'PM25': '20.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '7',
		'city': 'Žiar nad Hronom',
		'region': 'Banskobystrický kraj',
		'street': 'Jilemnického',
		'NO2': '',
		'PM10': '16.0',
		'PM25': '12.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '8',
		'city': 'Košice',
		'region': 'Košický kraj',
		'street': 'Štefánikova',
		'NO2': '22.0',
		'PM10': '26.0',
		'PM25': '17.0',
		'CO': '2292.0',
		'Benzen': '0.91'
	},
	{
		'id': '9',
		'city': 'Košice',
		'region': 'Košický kraj',
		'street': 'Amurská',
		'NO2': '',
		'PM10': '22.0',
		'PM25': '16.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '10',
		'city': 'Veľká Ida',
		'region': 'Košický kraj',
		'street': 'Letná',
		'NO2': '',
		'PM10': '37.0',
		'PM25': '22.0',
		'CO': '2736.0',
		'Benzen': ''
	},
	{
		'id': '11',
		'city': 'Kojšonovská hoľa',
		'region': 'Košický kraj',
		'street': '',
		'NO2': '3.0',
		'PM10': '',
		'PM25': '',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '12',
		'city': 'Trebišov',
		'region': 'Košický kraj',
		'street': 'T.G.Masaryka',
		'NO2': '11.0',
		'PM10': '22.0',
		'PM25': '16.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '13',
		'city': 'Strážske',
		'region': 'Košický kraj',
		'street': 'Mierová',
		'NO2': '',
		'PM10': '20.0',
		'PM25': '16.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '14',
		'city': 'Krompachy',
		'region': 'Košický kraj',
		'street': 'SNP',
		'NO2': '13.0',
		'PM10': '23.0',
		'PM25': '17.0',
		'CO': '1607.0',
		'Benzen': '0.94'
	},
	{
		'id': '15',
		'city': 'Nitra',
		'region': 'Nitriansky kraj',
		'street': 'Janíkovce',
		'NO2': '9.0',
		'PM10': '17.0',
		'PM25': '11.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '16',
		'city': 'Nitra',
		'region': 'Nitriansky kraj',
		'street': 'Štúrova',
		'NO2': '22.0',
		'PM10': '22.0',
		'PM25': '13.0',
		'CO': '1621.0',
		'Benzen': '0.46'
	},
	{
		'id': '17',
		'city': 'Komárno',
		'region': 'Nitriansky kraj',
		'street': 'Vnútorná Okružná',
		'NO2': '13.0',
		'PM10': '24.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '18',
		'city': 'Plášťovce',
		'region': 'Nitriansky kraj',
		'street': '',
		'NO2': '7.0',
		'PM10': '27.0',
		'PM25': '22.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '19',
		'city': 'Gánovce',
		'region': 'Prešovský kraj',
		'street': 'Meteo st.',
		'NO2': '8.0',
		'PM10': '',
		'PM25': '',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '20',
		'city': 'Humenné',
		'region': 'Prešovský kraj',
		'street': 'Nám. Slobody',
		'NO2': '9.0',
		'PM10': '23.0',
		'PM25': '19.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '21',
		'city': 'Prešov',
		'region': 'Prešovský kraj',
		'street': 'Arm. Gen. L. Svobodu',
		'NO2': '32.0',
		'PM10': '25.0',
		'PM25': '18.0',
		'CO': '1444.0',
		'Benzen': '0.82'
	},
	{
		'id': '22',
		'city': 'Vranov nad Topľov',
		'region': 'Prešovský kraj',
		'street': 'M.R.Štefánika',
		'NO2': '',
		'PM10': '20.0',
		'PM25': '16.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '23',
		'city': 'Stará Lesná',
		'region': 'Prešovský kraj',
		'street': '',
		'NO2': '4.0',
		'PM10': '11.0',
		'PM25': '8.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '24',
		'city': 'Starina',
		'region': 'Prešovský kraj',
		'street': 'Vodná nádrž',
		'NO2': '3.0',
		'PM10': '',
		'PM25': '',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '25',
		'city': 'Kolonické sedlo',
		'region': 'Prešovský kraj',
		'street': 'Hvezdáreň',
		'NO2': '',
		'PM10': '15.0',
		'PM25': '11.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '26',
		'city': 'Poprad',
		'region': 'Prešovský kraj',
		'street': 'Železničná',
		'NO2': '15.0',
		'PM10': '17.0',
		'PM25': '12.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '27',
		'city': 'Bardejov',
		'region': 'Prešovský kraj',
		'street': 'Pod Vinbargom',
		'NO2': '10.0',
		'PM10': '20.0',
		'PM25': '15.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '28',
		'city': 'Prievidza',
		'region': 'Trenčiansky kraj',
		'street': 'Malonecpalská',
		'NO2': '15.0',
		'PM10': '17.0',
		'PM25': '13.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '29',
		'city': 'Bystričky',
		'region': 'Trenčiansky kraj',
		'street': 'Rozvodňa SSE',
		'NO2': '',
		'PM10': '19.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '30',
		'city': 'Handlová',
		'region': 'Trenčiansky kraj',
		'street': 'Morovianska cesta',
		'NO2': '',
		'PM10': '16.0',
		'PM25': '13.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '31',
		'city': 'Púchov',
		'region': 'Trenčiansky kraj',
		'street': '1. mája',
		'NO2': '10.0',
		'PM10': '22.0',
		'PM25': '16.0',
		'CO': '1647.0',
		'Benzen': ''
	},
	{
		'id': '32',
		'city': 'Trenčín',
		'region': 'Trenčiansky kraj',
		'street': 'Hasičska',
		'NO2': '26.0',
		'PM10': '23.0',
		'PM25': '14.0',
		'CO': '1417.0',
		'Benzen': '0.78'
	},
	{
		'id': '33',
		'city': 'Senica',
		'region': 'Trnavský kraj',
		'street': 'Hviezdoslavova',
		'NO2': '',
		'PM10': '19.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '34',
		'city': 'Trnava',
		'region': 'Trnavský kraj',
		'street': 'Kollárova',
		'NO2': '28.0',
		'PM10': '21.0',
		'PM25': '13.0',
		'CO': '1018.0',
		'Benzen': '0.78'
	},
	{
		'id': '35',
		'city': 'Topoľníky',
		'region': 'Trnavský kraj',
		'street': 'Aszód',
		'NO2': '5.0',
		'PM10': '17.0',
		'PM25': '13.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '36',
		'city': 'Sereď',
		'region': 'Trnavský kraj',
		'street': 'Vinárska',
		'NO2': '13.0',
		'PM10': '19.0',
		'PM25': '12.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '37',
		'city': 'Bratislava',
		'region': 'Bratislavský kraj',
		'street': 'Kamenné nám.',
		'NO2': '',
		'PM10': '19.0',
		'PM25': '12.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '38',
		'city': 'Bratislava',
		'region': 'Bratislavský kraj',
		'street': 'Trnavské mýto',
		'NO2': '31.0',
		'PM10': '24.0',
		'PM25': '15.0',
		'CO': '780.0',
		'Benzen': '0.54'
	},
	{
		'id': '39',
		'city': 'Bratislava',
		'region': 'Bratislavský kraj',
		'street': 'Jeséniova',
		'NO2': '9.0',
		'PM10': '15.0',
		'PM25': '11.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '40',
		'city': 'Bratislava',
		'region': 'Bratislavský kraj',
		'street': 'Mamateyova',
		'NO2': '16.0',
		'PM10': '18.0',
		'PM25': '11.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '41',
		'city': 'Bratislava',
		'region': 'Bratislavský kraj',
		'street': 'Púchovská',
		'NO2': '13.0',
		'PM10': '19.0',
		'PM25': '13.0',
		'CO': '694.0',
		'Benzen': '0.35'
	},
	{
		'id': '42',
		'city': 'Malacky',
		'region': 'Bratislavský kraj',
		'street': 'Mierové nám.',
		'NO2': '21.0',
		'PM10': '22.0',
		'PM25': '14.0',
		'CO': '1334.0',
		'Benzen': '0.71'
	},
	{
		'id': '43',
		'city': 'Pezinok',
		'region': 'Bratislavský kraj',
		'street': 'Obrancov mieru',
		'NO2': '9.0',
		'PM10': '16.0',
		'PM25': '13.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '44',
		'city': 'Rohožník',
		'region': 'Bratislavský kraj',
		'street': 'Senická',
		'NO2': '11.0',
		'PM10': '21.0',
		'PM25': '14.0',
		'CO': '1426.0',
		'Benzen': '0.76'
	},
	{
		'id': '45',
		'city': 'Rovinka',
		'region': 'Bratislavský kraj',
		'street': '',
		'NO2': '12.0',
		'PM10': '19.0',
		'PM25': '',
		'CO': '667.0',
		'Benzen': '0.86'
	},
	{
		'id': '46',
		'city': 'Senec',
		'region': 'Bratislavský kraj',
		'street': 'Boldocká',
		'NO2': '20.0',
		'PM10': '20.0',
		'PM25': '14.0',
		'CO': '836.0',
		'Benzen': ''
	},
	{
		'id': '47',
		'city': 'Chopok',
		'region': 'Žilinský kraj',
		'street': '',
		'NO2': '2.0',
		'PM10': '',
		'PM25': '',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '48',
		'city': 'Liptovkský Mikuláš',
		'region': 'Žilinský kraj',
		'street': 'Školská',
		'NO2': '13.0',
		'PM10': '19.0',
		'PM25': '14.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '49',
		'city': 'Martin',
		'region': 'Žilinský kraj',
		'street': 'Jesenského',
		'NO2': '17.0',
		'PM10': '26.0',
		'PM25': '17.0',
		'CO': '1355.0',
		'Benzen': '0.77'
	},
	{
		'id': '50',
		'city': 'Oščadnica',
		'region': 'Žilinský kraj',
		'street': '',
		'NO2': '7.0',
		'PM10': '22.0',
		'PM25': '17.0',
		'CO': '',
		'Benzen': ''
	},
	{
		'id': '51',
		'city': 'Ružomberok',
		'region': 'Žilinský kraj',
		'street': 'Riadok',
		'NO2': '16.0',
		'PM10': '23.0',
		'PM25': '18.0',
		'CO': '2234.0',
		'Benzen': '1.11'
	},
	{
		'id': '52',
		'city': 'Žilina',
		'region': 'Žilinský kraj',
		'street': 'Obežná',
		'NO2': '20.0',
		'PM10': '24.0',
		'PM25': '17.0',
		'CO': '2160.0',
		'Benzen': ''
	},
]

const dataLimits = {
	PM10: 40,
	PM25: 20,
	NO2: 40,
	CO: 10000,
	Benzen: 5
};

const dataFormatter = (number: number) =>
    `${Intl.NumberFormat('sk').format(number/1).toString()} µg/m³`;

interface DataItem {
    city: string;
    street: string;
    [key: string]: string;
}

function transformData(data: DataItem[], key: string): { name: string; value: number }[] {
    return data
        .filter(item => item[key] !== '')
        .map(item => {
            return {
                name: item.street !== '' ? item.city+' - '+item.street : item.city,
                value: parseFloat(item[key])
            };
        }
	);
}

export function AirQualityBarlist() {
	const [extended, setExtended] = useState(false);
	return (
		<>
			<Card className="p-0 sm:mx-auto sm:max-w-lg">
				<div className="flex items-center justify-between border-b border-tremor-border p-6 dark:border-dark-tremor-border">
					<p className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
						Porovnanie znečistenia podľa zdroja
					</p>
				</div>
				<TabGroup defaultIndex={1} className="mt-6">
					<TabList>
						<Tab>PM10</Tab>
						<Tab>PM2.5</Tab>
						<Tab>NO2</Tab>
						<Tab>CO</Tab>
						<Tab>Benzen</Tab>
					</TabList>
					<TabPanels>
						<TabPanel>
							<div
								className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[330px]'}`}
							>
								<BarList data={transformData(data, "PM10")} valueFormatter={dataFormatter} sortOrder="ascending"/>
							</div>
						</TabPanel>
						<TabPanel>
							<div
								className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[330px]'}`}
							>
								<BarList data={transformData(data, "PM25")} valueFormatter={dataFormatter} sortOrder="ascending"/>
							</div>
						</TabPanel>
						<TabPanel>
							<div
								className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[330px]'}`}
							>
								<BarList data={transformData(data, "NO2")} valueFormatter={dataFormatter} sortOrder="ascending"/>
							</div>
						</TabPanel>
						<TabPanel>
							<div
								className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[330px]'}`}
							>
								<BarList data={transformData(data, "CO")} valueFormatter={dataFormatter} sortOrder="ascending"/>
							</div>
						</TabPanel>
						<TabPanel>
							<div
								className={`overflow-hidden p-6 ${extended ? '' : 'max-h-[330px]'}`}
							>
								<BarList data={transformData(data, "Benzen")} valueFormatter={dataFormatter} sortOrder="ascending"/>
							</div>
						</TabPanel>
					</TabPanels>
		
					<div
						className={`flex justify-center ${
						extended
							? 'px-6 pb-6'
							: 'absolute inset-x-0 bottom-0 rounded-b-tremor-default bg-gradient-to-t from-tremor-background to-transparent py-7 dark:from-dark-tremor-background'
						}`}
					>
						<button
							className="flex items-center justify-center rounded-tremor-small border border-tremor-border bg-tremor-background px-2.5 py-2 text-tremor-default font-medium text-tremor-content-strong shadow-tremor-input hover:bg-tremor-background-muted dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:text-dark-tremor-content-strong dark:shadow-dark-tremor-input hover:dark:bg-dark-tremor-background-muted"
							onClick={() => setExtended(!extended)}
							>
							{extended ? 'Zobraziť menej' : 'Zobraziť viac'}
						</button>
					</div>
				</TabGroup>
			</Card>
		</>
	);
}

export function AirQualityDetail() {
    const [selectedItem, setSelectedItem] = useState('0');

    const filteredData = selectedItem
        ? data.filter(item => item.id === selectedItem)
        : data;

    return (
        <>
            <Card className="p-0 sm:mx-auto sm:max-w-lg">
                <div className="flex items-center justify-between border-b border-tremor-border p-6 dark:border-dark-tremor-border">
                   <SearchSelect
						className="max-w-full"
						onValueChange={(value) => setSelectedItem(value)}
						placeholder={filteredData[0]?.street !== '' ? filteredData[0]?.city + ' - ' + filteredData[0]?.street : filteredData[0]?.city}
					>
						{data.map((item) => (
							<SearchSelectItem key={item.id} value={item.id}>
								{item.street !== '' ? item.city + ' - ' + item.street : item.city}
							</SearchSelectItem>
						))}
					</SearchSelect>
                </div>
				<div className="p-6">
					<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
						<span>PM10 {filteredData[0]?.PM10 ? filteredData[0]?.PM10 : 'bez meraní'}</span>
						<span>pod limitom ({dataLimits.PM10})</span>
					</p>
					{filteredData[0]?.PM10 ? <DeltaBar value={100*(dataLimits.PM10 - parseFloat(filteredData[0]['PM10']))/dataLimits.PM10}/> : null}
				</div>
				<div className="p-6">
					<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
						<span>PM2.5 {filteredData[0]?.PM25 ? filteredData[0]?.PM25 : 'bez meraní'}</span>
						<span>pod limitom ({dataLimits.PM25})</span>
					</p>
					{filteredData[0]?.PM25 ? <DeltaBar value={100*(dataLimits.PM25 - parseFloat(filteredData[0]['PM25']))/dataLimits.PM25} /> : null}
				</div>
				<div className="p-6">
					<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
						<span>NO2 {filteredData[0]?.NO2 ? filteredData[0]?.NO2 : 'bez meraní'}</span>
						<span>pod limitom ({dataLimits.NO2})</span>
					</p>
					{filteredData[0]?.NO2 ? <DeltaBar value={100*(dataLimits.NO2 - parseFloat(filteredData[0]['NO2']))/dataLimits.NO2} /> : null}
				</div>
				<div className="p-6">
					<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
						<span>CO {filteredData[0]?.CO ? filteredData[0]?.CO : 'bez meraní'}</span>
						<span>pod limitom ({dataLimits.CO})</span>
					</p>
					{filteredData[0]?.CO ? <DeltaBar value={100*(dataLimits.CO - parseFloat(filteredData[0]['CO']))/dataLimits.CO} /> : null}
				</div>
				<div className="p-6">
					<p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content flex items-center justify-between">
						<span>Benzen {filteredData[0]?.Benzen ? filteredData[0]?.Benzen : 'bez meraní'}</span>
						<span>pod limitom ({dataLimits.Benzen})</span>
					</p>
					{filteredData[0]?.Benzen ? <DeltaBar value={100*(dataLimits.Benzen - parseFloat(filteredData[0]['Benzen']))/dataLimits.Benzen} /> : null}
				</div>
            </Card>
        </>
    );
}