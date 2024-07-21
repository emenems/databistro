'use client'; 
import { 
    Divider,
    NumberInput
} from '@tremor/react';
import {
    DonutChart,
    Card,
    List,
    ListItem,
    Legend,
 } from "@tremor/react";
import { useState } from 'react'

const currencyFormatter = (number: number) => {
    return Intl.NumberFormat('sk', {
            minimumFractionDigits: 2,      
            maximumFractionDigits: 2
        }
    ).format(number).toString() + '€';
};

function calculateTax(
    { rent, months, monthsExpenses, stateTaxRate, stateTaxDeductable, electricity, gas, water, administration, internet, otherServices } :
    { rent: number, monthsExpenses: number, months: number, stateTaxRate: number, stateTaxDeductable: number, electricity: number, gas: number, water: number, administration: number, internet: number, otherServices: number }
    ) {
    const totalExpenses = electricity*monthsExpenses + gas*monthsExpenses + water*monthsExpenses + administration*monthsExpenses + internet*monthsExpenses + otherServices*monthsExpenses
    let totalIncome = rent*months
    let correctedIncome = rent*months
    if (totalIncome > 2461.41) {
        correctedIncome = totalIncome - stateTaxDeductable;
    } else {
        if (totalIncome <= stateTaxDeductable) {
            return 0
        }
    }
    if (totalExpenses >= correctedIncome) {
        return 0;
    }
    const correctionRatio = correctedIncome/totalIncome
    const correctedExpenses = totalExpenses*correctionRatio
    const actualTax = (correctedIncome - correctedExpenses)*stateTaxRate/100
    return actualTax;
}

function mapClassColor( name: string ) {
    switch (name) {
        case 'Štátna daň':
            return 'cyan';
        case 'Miestna daň':
            return 'cyan';
        case 'Elektrina':
            return 'blue';
        case 'Plyn':
            return 'blue';
        case 'Voda':
            return 'blue';
        case 'Elektrina':
            return 'blue';
        case 'Družstvo':
            return 'blue';
        case 'Internet a TV':
            return 'blue';
        case 'Ostatné služby':
            return 'blue';
        default:
            return 'fuchsia';
    }
}

function prepExpenses(
    { actualTax, localTax, electricity, gas, water, administration, internet, otherServices, insurance, realEstateAgent, otherExpenses, monthsExpenses } :
    { actualTax: number, localTax: number, electricity: number, gas: number, water: number, administration: number, internet: number, otherServices: number, insurance: number, realEstateAgent: number, otherExpenses: number, monthsExpenses: number} 
    ) {
    const totalExpensesMonth = electricity + gas + water + administration + internet + otherServices + localTax/monthsExpenses +
                                actualTax/monthsExpenses + insurance/monthsExpenses + realEstateAgent/monthsExpenses + otherExpenses/monthsExpenses;
    const totalExpenses = electricity*monthsExpenses + gas*monthsExpenses + water*monthsExpenses + administration*monthsExpenses + internet*monthsExpenses + otherServices*monthsExpenses + 
                            localTax + actualTax + insurance + realEstateAgent + otherExpenses;
    const expenses = [
        {
            name: 'Štátna daň',
            monthly: actualTax/monthsExpenses,
            yearly: actualTax,
            share: (100 * (actualTax / monthsExpenses) / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Miestna daň',
            monthly: localTax/monthsExpenses,
            yearly: localTax,
            share: (100 * (localTax / monthsExpenses) / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Elektrina',
            monthly: electricity,
            yearly: electricity*monthsExpenses,
            share: (100 * electricity / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Plyn',
            monthly: gas,
            yearly: gas*monthsExpenses,
            share: (100 * gas / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Voda',
            monthly: water,
            yearly: water*monthsExpenses,
            share: (100 * water / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Družstvo',
            monthly: administration,
            yearly: administration*monthsExpenses,
            share: (100 * administration / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Internet a TV',
            monthly: internet,
            yearly: internet*monthsExpenses,
            share: (100 * internet / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Ostatné služby',
            monthly: otherServices,
            yearly: otherServices*monthsExpenses,
            share: (100 * otherServices / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Poistenie',
            monthly: (insurance / monthsExpenses),
            yearly: insurance,
            share: (100 * (insurance / monthsExpenses) / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Realitný maklér',
            monthly: (realEstateAgent / monthsExpenses),
            yearly: realEstateAgent,
            share: (100 * (realEstateAgent / monthsExpenses) / totalExpensesMonth).toFixed(2)
        },
        {
            name: 'Iné náklady',
            monthly: (otherExpenses / monthsExpenses),
            yearly: otherExpenses,
            share: (100 * (otherExpenses / monthsExpenses) / totalExpensesMonth).toFixed(2)
        }
    ]
    return {totalExpenses, expenses};
}

function prepIncomeExpenses( {totalIncome, totalExpenses}: {totalIncome: number, totalExpenses:number}) {
    const incomeExpenses = [
        {
            "name": 'Príjem',
            "value": totalIncome
        },
        {
            "name": 'Výdavky',
            "value": totalExpenses
        }
    ]
    const difference = totalIncome - totalExpenses
    return { incomeExpenses, difference }
}

export default function RentCalc() {
    const [rent, setRent] = useState<number>(540)
    const [months, setMonths] = useState<number>(12)
    const [monthsExpenses, setMonthsExpenses] = useState<number>(12)
    const [stateTaxRate, setStateTaxRate] = useState<number>(19);
    const [stateTaxDeductable, setStateTaxDeductable] = useState<number>(500);
    const [localTax, setLocalTax] = useState<number>(26.82);
    const [electricity, setElectricity] = useState<number>(18);
    const [gas, setGas] = useState<number>(0);
    const [water, setWater] = useState<number>(0);
    const [administration, setAdministration] = useState<number>(147.16);
    const [internet, setInternet] = useState<number>(0);
    const [otherServices, setOtherServices] = useState<number>(0);
    const [insurance, setInsurance] = useState<number>(114.15);
    const [realEstateAgent, setRealEstateAgent] = useState<number>(540);
    const [otherExpenses, setOtherExpenses] = useState<number>(0);

    const totalIncome = rent*months

    const actualTax= calculateTax( {rent, months, monthsExpenses, stateTaxRate, stateTaxDeductable, electricity, gas, water, administration, internet, otherServices})
    const {totalExpenses, expenses} = prepExpenses({ actualTax, localTax, electricity, gas, water, administration, internet, otherServices, insurance, realEstateAgent, otherExpenses, monthsExpenses });
    const sortedExpenses = [...expenses].sort((a, b) => b.yearly - a.yearly);

    const { incomeExpenses, difference } = prepIncomeExpenses( {totalIncome, totalExpenses})

    const legendNames = ['Celovo príjem', 'Celkovo Výdavky', 'Dane', 'Odpočítateľné', 'Neodpočítateľné'];
    const legendColors = ['violet', 'red', 'cyan', 'blue', 'fuchsia'];
  return (
    <>
        <div className="sm:mx-auto sm:max-w-2xl">
            <form action="#" method="post" className="mt-8">
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="rent"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Nájomné (za mesiac)
                        </label>
                        <div className="col-span-full sm:col-span-2">
                            <NumberInput
                                id="rent"
                                name="rent"
                                placeholder={rent.toString()}
                                defaultValue={rent}
                                onChange={(e) => setRent(parseFloat(e.target.value))}
                                className="mt-2"
                                required
                                min={1}
                                max={9999}
                                step={50}
                            />
                        </div>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="months"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Doba prenájmu (mesiacov)
                        </label>
                        <div className="col-span-full sm:col-span-2">
                            <NumberInput
                                id="months"
                                name="months"
                                placeholder={months.toString()}
                                defaultValue={months}
                                onChange={(e) => setMonths(parseFloat(e.target.value))}
                                className="mt-2"
                                required
                                min={1}
                                max={12}
                                step={1}
                            />
                        </div>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="months"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Doba výdavkov (mesiacov)
                        </label>
                        <div className="col-span-full sm:col-span-2">
                            <NumberInput
                                id="months"
                                name="months"
                                placeholder={monthsExpenses.toString()}
                                defaultValue={monthsExpenses}
                                onChange={(e) => setMonthsExpenses(parseFloat(e.target.value))}
                                className="mt-2"
                                required
                                min={months}
                                max={12}
                                step={1}
                            />
                        </div>
                    </div>
                    {/* State tax */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="state-tax"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Sadzba dane (v %)
                        </label>
                        <NumberInput
                            id="state-tax"
                            name="state-tax"
                            placeholder={stateTaxRate.toString()}
                            defaultValue={stateTaxRate}
                            onChange={(e) => setStateTaxRate(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={100}
                            step={6}
                        />
                    </div>
                    {/* Local tax */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="state-tax-deductable"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Oslobodené od dane
                        </label>
                        <NumberInput
                            id="state-tax-deductable"
                            name="state-tax-deductable"
                            placeholder={stateTaxDeductable.toString()}
                            defaultValue={stateTaxDeductable}
                            onChange={(e) => setStateTaxDeductable(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={500}
                            step={100}
                        />
                    </div>
                    {/* Local tax */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="local-tax"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Miestne dane ({monthsExpenses} {monthsExpenses > 1? 'mesiacov': 'mesiac'})
                            <span className="text-fuchsia-500">*</span>
                            <span className="text-cyan-500">*</span>
                        </label>
                        <NumberInput
                            id="local-tax"
                            name="local-tax"
                            placeholder={localTax.toString()}
                            defaultValue={localTax}
                            onChange={(e) => setLocalTax(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Electricity - deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="electricity"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Elektrina (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="electricity"
                            name="electricity"
                            placeholder={electricity.toString()}
                            defaultValue={electricity}
                            onChange={(e) => setElectricity(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Gas - deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="gas"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Plyn (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="gas"
                            name="gas"
                            placeholder={gas.toString()}
                            defaultValue={gas}
                            onChange={(e) => setGas(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Water - deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="water"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Voda (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="water"
                            name="water"
                            placeholder={water.toString()}
                            defaultValue={water}
                            onChange={(e) => setWater(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Administration - deductable*/}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="administration"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Družstvo (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="administration"
                            name="administration"
                            placeholder={administration.toString()}
                            defaultValue={administration}
                            onChange={(e) => setAdministration(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Internet - deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="internet"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Internet a TV (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="internet"
                            name="internet"
                            placeholder={internet.toString()}
                            defaultValue={internet}
                            onChange={(e) => setInternet(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Other - deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="other-services"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Ostatné služby (za mesiac)
                            <span className="text-blue-500">*</span>
                        </label>
                        <NumberInput
                            id="other-services"
                            name="other-services"
                            placeholder={otherServices.toString()}
                            defaultValue={otherServices}
                            onChange={(e) => setOtherServices(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Insurance - not-deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="insurance"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Poistenie ({monthsExpenses} {monthsExpenses > 1? 'mesiacov': 'mesiac'})
                            <span className="text-fuchsia-500">*</span>
                        </label>
                        <NumberInput
                            id="insurance"
                            name="insurance"
                            placeholder={insurance.toString()}
                            defaultValue={insurance}
                            onChange={(e) => setInsurance(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Real-estate-agent - not-deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="real-estate-agent"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Realitný maklér ({monthsExpenses} {monthsExpenses > 1? 'mesiacov': 'mesiac'})
                            <span className="text-fuchsia-500">*</span>
                        </label>
                        <NumberInput
                            id="real-estate-agent"
                            name="real-estate-agent"
                            placeholder={realEstateAgent.toString()}
                            defaultValue={realEstateAgent}
                            onChange={(e) => setRealEstateAgent(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    {/* Other - not-deductable */}
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="other-expenses"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Iné naklady ({monthsExpenses} {monthsExpenses > 1? 'mesiacov': 'mesiac'})
                            <span className="text-fuchsia-500">*</span>
                        </label>
                        <NumberInput
                            id="other-expenses"
                            name="other-expenses"
                            placeholder={otherExpenses.toString()}
                            defaultValue={otherExpenses}
                            onChange={(e) => setOtherExpenses(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                </div>

                <Divider />
                <div className="col-span-full sm:col-span-6">
                    <label
                        htmlFor="legend1"
                        className="text-tremor-default font-small text-tremor-content-content dark:text-dark-tremor-content"
                    >
                        <span className="text-blue-500">*</span>započítateľné výdavky{' '}{' '}
                        <span className="text-fuchsia-500">*</span>nezapočítateľné výdavky.{' '}{' '}
                    </label>
                </div>
                <Card className="col-span-full sm:col-span-6 mt-8">
                    <h2 className='flex justify-center items-center'>
                        Čístý príjem za {months} {months > 1? 'mesiacov': 'mesiac'}: {currencyFormatter(difference)}
                    </h2>
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:max-w-3xl sm:grid-cols-2">
                        <div >
                            <h3 className="flex justify-center items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Príjmy - Výdavky
                            </h3>
                            <DonutChart
                                className="mt-8"
                                data={incomeExpenses}
                                showTooltip={true}
                                label={difference > 0 ? '+'+currencyFormatter(difference) : currencyFormatter(difference)}
                                showAnimation={true}
                                valueFormatter={currencyFormatter}
                                colors={['violet', 'red', 'cyan', 'blue', 'fuchsia']}
                            />
                        </div>
                        <div >
                            <h3 className="flex justify-center items-center text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                Prehľad výdavkov ({monthsExpenses} {monthsExpenses > 1? 'mesiacov': 'mesiac'})
                            </h3>
                            <DonutChart
                                className="mt-8"
                                data={expenses}
                                index='name'
                                category='yearly'
                                showTooltip={true}
                                label={'-'+currencyFormatter(totalExpenses)}
                                showAnimation={true}
                                valueFormatter={currencyFormatter}
                                colors={['cyan', 'cyan', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'fuchsia', 'fuchsia', 'fuchsia']}
                            />
                        </div>
                    </div>
                    <Legend
                        categories={legendNames}
                        colors={legendColors}
                        className="max-w-full mt-8"
                    />
                    <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content">
                    <span>Výdavky za mesiac</span>
                    <span>Hodnota ↓ / Podiel</span>
                    </p>
                    <List className="mt-2">
                        {sortedExpenses.map((item) => (
                            <ListItem key={item.name} className="space-x-6">
                            <div className="flex items-center space-x-2.5 truncate">
                                <span
                                className={'bg-' + mapClassColor(item.name) + '-500 ' + 'h-2.5 w-2.5 shrink-0 rounded-sm'}
                                aria-hidden={true}
                                />
                                <span className="truncate dark:text-dark-tremor-content-emphasis">
                                {item.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong">
                                {currencyFormatter(item.monthly)}
                                </span>
                                <span className="rounded-tremor-small bg-tremor-background-subtle px-1.5 py-0.5 text-tremor-label font-medium tabular-nums text-tremor-content-emphasis dark:bg-dark-tremor-background-subtle dark:text-dark-tremor-content-emphasis">
                                {item.share +'%'}
                                </span>
                            </div>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </form>
        </div>
    </>
  );
}