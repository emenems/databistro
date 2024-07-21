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
    AreaChart,
    Select,
    SelectItem
} from "@tremor/react";
import { RiMoneyEuroCircleLine, RiDiscountPercentLine, RiEditCircleLine } from '@remixicon/react';

import { useState } from 'react'
import {
    calculateCompoundInterest,
    calculateSimpleInterest,
    calculateTax,
    currencyFormatter,
    currencyFormatterNoDecimals,
    inflationPriceCalculator,
    inflationRentCalculator,
    prepExpenses,
    prepIncomeExpenses,
    stockReturnSeriesDemo,
    mapClassColor
} from '@/app/_components/rentcalc/utils';
import {StockReturnSeries} from '@/interfaces/rent';

export default function RentCalc( { stockData = stockReturnSeriesDemo }: { stockData: StockReturnSeries[] } ) {
    const [rent, setRent] = useState<number>(565)
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
    const [price, setPrice] = useState<number>(130000);
    const [interestRate, setInterestRate] = useState<number>(4.2);
    const [interestTax, setInterestTax] = useState<number>(19);
    const [inflationRent, setInflationRent] = useState<number>(2.0);
    const [inflationPrice, setInflationPrice] = useState<number>(2.0);
    const [stockType, setStockType] = useState<string>("mean");
    const [stockFee, setStockFee] = useState<number>(0.5);

    const totalIncome = rent*months

    const actualTax= calculateTax( {rent, months, monthsExpenses, stateTaxRate, stateTaxDeductable, electricity, gas, water, administration, internet, otherServices})
    const {totalExpenses, expenses} = prepExpenses({ actualTax, localTax, electricity, gas, water, administration, internet, otherServices, insurance, realEstateAgent, otherExpenses, monthsExpenses });
    const sortedExpenses = [...expenses].sort((a, b) => b.yearly - a.yearly);

    const { incomeExpenses, netIncome } = prepIncomeExpenses( {totalIncome, totalExpenses})

    const legendNames = ['Celovo príjem', 'Celkovo Výdavky', 'Dane', 'Odpočítateľné', 'Neodpočítateľné'];
    const legendColors = ['violet', 'red', 'cyan', 'blue', 'fuchsia'];

    const alternativeMonths = [12, 24, 36, 48, 60, 72, 84, 96, 108, 120];

    const chartData = alternativeMonths.map(month => {
        const year = month / 12;
        const Rent = inflationRentCalculator({ initialRent: netIncome, years: year, inflationRate: inflationRent });
        const Price = inflationPriceCalculator({price, inflationPrice, months: month, interestTax});
        const RentPrice = Rent + Price;
        const Compound = calculateCompoundInterest({ price, interestRate, interestTax, months: month });
        const Simple = calculateSimpleInterest({ price, interestRate, interestTax, months: month });
        const stockValue = stockData
          .filter(item => item.year === year) 
          .map(item => {
            let value;
            switch (stockType) {
                case 'mean':
                    value = item.mean * price * (1 - stockFee * year / 100);
                    break;
                case 'min':
                    value = item.min * price * (1 - stockFee * year / 100);
                    break;
                case 'max':
                    value = item.max * price * (1 - stockFee * year / 100);
                    break;
                default:
                    value = 0; 
            }
            return value;
          });

        if (year <= 1 && stockValue.length > 0) {
          stockValue[0] = stockValue[0] - (stockValue[0] * interestTax / 100);
        }
    
        return {
          Rok: year.toFixed(0),
          'Cena + inflácia': Price,
          'S prenájmom': RentPrice,
          'Len prenájom': Rent,
          'Zložené úročenie': Compound - price,
          'Termínovaný vklad': Simple - price,
          'Dow Jones': stockValue.length > 0 ? stockValue[0] : null,
        };
    });
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
                                icon={RiMoneyEuroCircleLine}
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
                                icon={RiMoneyEuroCircleLine}
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
                                icon={RiMoneyEuroCircleLine}
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
                            Sadzba dane
                        </label>
                        <NumberInput
                            id="state-tax"
                            name="state-tax"
                            placeholder={stateTaxRate.toString()}
                            defaultValue={stateTaxRate}
                            onChange={(e) => setStateTaxRate(parseFloat(e.target.value))}
                            className="mt-2"
                            icon={RiDiscountPercentLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
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
                            icon={RiMoneyEuroCircleLine}
                            min={0}
                            max={9999}
                            step={10}
                        />
                    </div>
                    <Divider className='col-span-full sm:col-span-6 -mt-2'/>
                    <div className="col-span-full sm:col-span-6 -mt-6">
                        <label
                            htmlFor="roi-note"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Výpočet výnostnosti a porovnanie s alternatívnym investovaním
                            <span className="text-gray-500">*</span>
                        </label>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="price"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Obstarávacia cena
                            <span className="text-gray-500">*</span>
                        </label>
                        <NumberInput
                            id="price"
                            name="price"
                            placeholder={price.toString()}
                            defaultValue={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiMoneyEuroCircleLine}
                            min={0}
                            max={2999999}
                            step={10000}
                        />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="interest-rate"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Výška alternatívneho úroku
                            <span className="text-gray-500">*</span>
                        </label>
                        <NumberInput
                            id="interest-rate"
                            name="interest-rate"
                            placeholder={interestRate.toString()}
                            defaultValue={interestRate}
                            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiMoneyEuroCircleLine}
                            min={0}
                            max={99}
                            step={0.1}
                        />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="interest-rate-tax"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Dane a odvody
                            <span className="text-gray-500">*</span>
                        </label>
                        <NumberInput
                            id="interest-rate-tax"
                            name="interest-rate-tax"
                            placeholder={interestTax.toString()}
                            defaultValue={interestTax}
                            onChange={(e) => setInterestTax(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiDiscountPercentLine}
                            min={0}
                            max={99}
                            step={1}
                        />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="inflation-price"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Inflácia: nehnuteľnosti (rok)
                            <span className="text-gray-500">*</span>
                        </label>
                        <NumberInput
                            id="inflation-price"
                            name="inflation-price"
                            placeholder={inflationPrice.toString()}
                            defaultValue={inflationPrice}
                            onChange={(e) => setInflationPrice(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiDiscountPercentLine}
                            min={0}
                            max={99}
                            step={0.1}
                        />
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="inflation-rent"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Inflácia: nájom-náklady (rok)
                            <span className="text-gray-500">*</span>
                        </label>
                        <NumberInput
                            id="inflation-rent"
                            name="inflation-rent"
                            placeholder={inflationRent.toString()}
                            defaultValue={inflationRent}
                            onChange={(e) => setInflationRent(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiDiscountPercentLine}
                            min={0}
                            max={99}
                            step={0.1}
                        />
                    </div>
                    <div></div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="stock-type"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Dow Jones index
                        </label>
                        <Select
                            id="stock-type"
                            name="stock-type"
                            defaultValue={stockType.toString()}
                            onValueChange={(value) => setStockType(value)}
                            className="mt-2"
                            icon={RiEditCircleLine}
                        >
                            <SelectItem value="mean">Priemerné</SelectItem>
                            <SelectItem value="min">Najhorší scénar</SelectItem>
                            <SelectItem value="max">Najlepší scénar</SelectItem>
                        </Select>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                        <label
                            htmlFor="stock-fee"
                            className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong"
                        >
                            Správcovský poplatok (rok)
                        </label>
                        <NumberInput
                            id="stock-fee"
                            name="stock-fee"
                            placeholder={stockFee.toString()}
                            defaultValue={stockFee}
                            onChange={(e) => setStockFee(parseFloat(e.target.value))}
                            className="mt-2"
                            required
                            icon={RiDiscountPercentLine}
                            min={0}
                            max={99}
                            step={0.1}
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
                        <span className="text-fuchsia-500">*</span>nezapočítateľné výdavky{' '}{' '}
                        <span className="text-gray-500">*</span>nepovinné{' '}{' '}
                    </label>
                </div>
                <Card className="col-span-full sm:col-span-6 mt-8">
                    <h2 className='flex justify-center items-center'>
                        Čístý príjem za {months} {months > 1? 'mesiacov': 'mesiac'}: {currencyFormatter(netIncome)}
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
                                label={netIncome > 0 ? '+'+currencyFormatter(netIncome) : currencyFormatter(netIncome)}
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
                <Card className="col-span-full sm:col-span-6 mt-8">
                    <h2 className='flex justify-center items-center'>
                        Porovnanie čistého výnosu s alternatívnym investovaním
                    </h2>
                    <div className="text-right">
                        <AreaChart
                            className="mt-8 text-right"
                            data={chartData}
                            index={'Rok'}
                            categories={['Cena + inflácia', 'S prenájmom', 'Zložené úročenie', 'Termínovaný vklad', 'Dow Jones']}
                            showTooltip={true}
                            showAnimation={true}
                            valueFormatter={currencyFormatterNoDecimals}
                            colors={['sky', 'indigo', 'red', 'yellow', 'emerald']}
                            yAxisWidth={75}
                        />
                    </div>
                    <p className="mt-8 flex items-center justify-between text-tremor-label text-tremor-content dark:text-dark-tremor-content text-right">
                        <span>Rokov</span>
                        <span>Cena + inflácia</span>
                        <span>S prenájmom</span>
                        <span>Zložené úročenie</span>
                        <span>Termínovaný vklad</span>
                        <span>Dow Jones</span>
                    </p>

                    <List className="mt-2 text-right">
                        {chartData.map((item) => (({ Rok, 'S prenájmom': RentPrice, 'Cena + inflácia': Price, 'Zložené úročenie': compound, 'Termínovaný vklad': simple, 'Dow Jones': dowJones}) => (
                            <ListItem key={Rok} className="space-x-6 text-right">
                            <div className="flex items-center space-x-2.5 truncate text-right">
                                <span className="truncate dark:text-dark-tremor-content-emphasis text-right">
                                {Rok}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong text-right">
                                {currencyFormatterNoDecimals(Price)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong text-right">
                                {currencyFormatterNoDecimals(RentPrice)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong text-right">
                                {currencyFormatterNoDecimals(compound)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong text-right">
                                {currencyFormatterNoDecimals(simple)}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-right">
                                <span className="font-medium tabular-nums text-tremor-content-strong dark:text-dark-tremor-content-strong text-right">
                                {currencyFormatterNoDecimals(dowJones? dowJones: 0)}
                                </span>
                            </div>
                            </ListItem>
                        ))(item))}
                    </List>
                    </Card>
            </form>
        </div>
    </>
  );
}