import {StockReturnSeries} from '@/interfaces/rent';

// data for ^DJI, 2005-06-01 - 2025-06-20
export const stockReturnSeriesDemo: StockReturnSeries[] =[
    { year: 1, mean: 0.0852, min: -0.4619, max: 0.7439 },
    { year: 2, mean: 0.1661, min: -0.466, max: 0.8722 },
    { year: 3, mean: 0.2425, min: -0.4038, max: 0.9657 },
    { year: 4, mean: 0.3668, min: -0.2372, max: 1.2067 },
    { year: 5, mean: 0.5029, min: -0.1139, max: 1.4975 },
    { year: 6, mean: 0.6383, min: 0.0082, max: 1.7289 },
    { year: 7, mean: 0.7922, min: 0.1454, max: 1.5958 },
    { year: 8, mean: 0.9759, min: 0.1564, max: 2.1927 },
    { year: 9, mean: 1.1497, min: 0.2392, max: 2.8458 },
    { year: 10, mean: 1.3062, min: 0.4386, max: 2.9259 },
];

export const currencyFormatter = (number: number) => {
    return Intl.NumberFormat('sk', {
            minimumFractionDigits: 2,      
            maximumFractionDigits: 2
        }
    ).format(number).toString() + '€';
};

export const currencyFormatterNoDecimals = (number: number) => {
    return Intl.NumberFormat('sk', {
            minimumFractionDigits: 0,      
            maximumFractionDigits: 0
        }
    ).format(number).toString() + '€';
}

export function calculateTax(
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

export function calculateCompoundInterest(
    { price, interestRate, interestTax, months } :
    { price: number, interestRate: number, interestTax: number, months: number }
    ) {
    const totalPeriods = months/12;
    const effectiveRate = (interestRate / 100) * (1 - interestTax / 100);   
    const futureValue = price * Math.pow(1 + effectiveRate, totalPeriods);
    return futureValue;
}

export function calculateSimpleInterest(
    { price, interestRate, interestTax, months } :
    { price: number, interestRate: number, interestTax: number, months: number }
    ) {
    const monthlyRate = (interestRate / 100) / 12;
    const effectiveRate = monthlyRate * (1 - interestTax / 100);
    const interest = price * effectiveRate * months;
    const futureValue = price + interest;
    return futureValue;
}

export function mapClassColor(name: string) {
    switch (name) {
        case 'Štátna daň':
        case 'Miestna daň':
            return 'cyan';
        case 'Elektrina':
        case 'Plyn':
        case 'Voda':
        case 'Družstvo':
        case 'Internet a TV':
        case 'Ostatné služby':
            return 'blue';
        default:
            return 'fuchsia';
    }
}

export function prepExpenses(
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

export function prepIncomeExpenses( {totalIncome, totalExpenses}: {totalIncome: number, totalExpenses:number}) {
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
    const netIncome = totalIncome - totalExpenses
    return { incomeExpenses, netIncome }
}

export function inflationPriceCalculator( {price, inflationPrice, months, interestTax} : {price: number, inflationPrice: number, months: number, interestTax: number}) {
    const priceInflated = price * Math.pow(1 + inflationPrice / 100, months / 12);
    const difference = priceInflated - price;
    if (months <= 5*12) {
        return difference * (1 - interestTax / 100);
    } else {
        return difference;
    }
}

export function inflationRentCalculator({ initialRent, years, inflationRate }: {initialRent: number, years: number, inflationRate: number}): number {
    let totalIncome = 0;
  
    for (let year = 1; year <= years; year++) {
      if (year <= 1.01) {
        totalIncome += initialRent;
      } else {
        totalIncome += initialRent * Math.pow(1 + inflationRate / 100, year - 1);
      }
    }
  
    return totalIncome;
}
