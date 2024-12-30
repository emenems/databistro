'use client';

import { BarChart, Card, AreaChart } from '@tremor/react';

const monthlyData = [
    {'date': 'Jan', 'schválené':  25, 'neschválené':  19},
    {'date': 'Feb', 'schválené':  110, 'neschválené':  454},
    {'date': 'Apr', 'schválené':  124, 'neschválené':  23},
    {'date': 'May', 'schválené':  57, 'neschválené':  61},
    {'date': 'Jun', 'schválené':  183, 'neschválené':  85},
    {'date': 'Jul', 'schválené':  8, 'neschválené':  3},
    {'date': 'Aug', 'schválené':  0, 'neschválené':  8},
    {'date': 'Sep', 'schválené':  152, 'neschválené':  48},
    {'date': 'Oct', 'schválené':  139, 'neschválené':  69},
    {'date': 'Nov', 'schválené':  174, 'neschválené':  40},
    {'date': 'Dec', 'schválené':  78, 'neschválené':  86}
]

const voteData = [
    {'hlasov': 0, 'počet': 30},
    {'hlasov': 1, 'počet': 10},
    {'hlasov': 2, 'počet': 0},
    {'hlasov': 3, 'počet': 2},
    {'hlasov': 4, 'počet': 0},
    {'hlasov': 5, 'počet': 3},
    {'hlasov': 6, 'počet': 1},
    {'hlasov': 7, 'počet': 0},
    {'hlasov': 8, 'počet': 0},
    {'hlasov': 9, 'počet': 7},
    {'hlasov': 10, 'počet': 7},
    {'hlasov': 11, 'počet': 8},
    {'hlasov': 12, 'počet': 10},
    {'hlasov': 13, 'počet': 23},
    {'hlasov': 14, 'počet': 40},
    {'hlasov': 15, 'počet': 36},
    {'hlasov': 16, 'počet': 67},
    {'hlasov': 17, 'počet': 56},
    {'hlasov': 18, 'počet': 22},
    {'hlasov': 19, 'počet': 6},
    {'hlasov': 20, 'počet': 11},
    {'hlasov': 21, 'počet': 10},
    {'hlasov': 22, 'počet': 12},
    {'hlasov': 23, 'počet': 15},
    {'hlasov': 24, 'počet': 11},
    {'hlasov': 25, 'počet': 9},
    {'hlasov': 26, 'počet': 8},
    {'hlasov': 27, 'počet': 9},
    {'hlasov': 28, 'počet': 6},
    {'hlasov': 29, 'počet': 11},
    {'hlasov': 30, 'počet': 11},
    {'hlasov': 31, 'počet': 13},
    {'hlasov': 32, 'počet': 13},
    {'hlasov': 33, 'počet': 6},
    {'hlasov': 34, 'počet': 6},
    {'hlasov': 35, 'počet': 4},
    {'hlasov': 36, 'počet': 3},
    {'hlasov': 37, 'počet': 2},
    {'hlasov': 38, 'počet': 7},
    {'hlasov': 39, 'počet': 6},
    {'hlasov': 40, 'počet': 8},
    {'hlasov': 41, 'počet': 2},
    {'hlasov': 42, 'počet': 3},
    {'hlasov': 43, 'počet': 7},
    {'hlasov': 44, 'počet': 6},
    {'hlasov': 45, 'počet': 4},
    {'hlasov': 46, 'počet': 7},
    {'hlasov': 47, 'počet': 12},
    {'hlasov': 48, 'počet': 10},
    {'hlasov': 49, 'počet': 10},
    {'hlasov': 50, 'počet': 12},
    {'hlasov': 51, 'počet': 24},
    {'hlasov': 52, 'počet': 13},
    {'hlasov': 53, 'počet': 15},
    {'hlasov': 54, 'počet': 14},
    {'hlasov': 55, 'počet': 14},
    {'hlasov': 56, 'počet': 9},
    {'hlasov': 57, 'počet': 15},
    {'hlasov': 58, 'počet': 16},
    {'hlasov': 59, 'počet': 19},
    {'hlasov': 60, 'počet': 24},
    {'hlasov': 61, 'počet': 33},
    {'hlasov': 62, 'počet': 33},
    {'hlasov': 63, 'počet': 22},
    {'hlasov': 64, 'počet': 9},
    {'hlasov': 65, 'počet': 14},
    {'hlasov': 66, 'počet': 12},
    {'hlasov': 67, 'počet': 9},
    {'hlasov': 68, 'počet': 4},
    {'hlasov': 69, 'počet': 1},
    {'hlasov': 70, 'počet': 2},
    {'hlasov': 71, 'počet': 0},
    {'hlasov': 72, 'počet': 3},
    {'hlasov': 73, 'počet': 7},
    {'hlasov': 74, 'počet': 10},
    {'hlasov': 75, 'počet': 20},
    {'hlasov':76, 'počet': 154},
    {'hlasov':77, 'počet': 90},
    {'hlasov':78, 'počet': 118},
    {'hlasov':79, 'počet': 109},
    {'hlasov':80, 'počet': 9},
    {'hlasov':81, 'počet': 4},
    {'hlasov':82, 'počet': 1},
    {'hlasov':83, 'počet': 4},
    {'hlasov':84, 'počet': 11},
    {'hlasov':85, 'počet': 15},
    {'hlasov':86, 'počet': 13},
    {'hlasov':87, 'počet': 32},
    {'hlasov':88, 'počet': 12},
    {'hlasov':89, 'počet': 10},
    {'hlasov':90, 'počet': 13},
    {'hlasov':91, 'počet': 2},
    {'hlasov':92, 'počet': 3},
    {'hlasov':93, 'počet': 7},
    {'hlasov':94, 'počet': 1},
    {'hlasov':95, 'počet': 2},
    {'hlasov':96, 'počet': 3},
    {'hlasov':97, 'počet': 8},
    {'hlasov':98, 'počet': 2},
    {'hlasov':99, 'počet': 3},
    {'hlasov':100, 'počet': 6},
    {'hlasov':101, 'počet': 8},
    {'hlasov':102, 'počet': 6},
    {'hlasov':103, 'počet': 7},
    {'hlasov':104, 'počet': 11},
    {'hlasov':105, 'počet': 11},
    {'hlasov':106, 'počet': 9},
    {'hlasov':107, 'počet': 9},
    {'hlasov':108, 'počet': 8},
    {'hlasov':109, 'počet': 16},
    {'hlasov':110, 'počet': 8},
    {'hlasov':111, 'počet': 8},
    {'hlasov':112, 'počet': 8},
    {'hlasov':113, 'počet': 1},
    {'hlasov':114, 'počet': 7},
    {'hlasov':115, 'počet': 9},
    {'hlasov':116, 'počet': 7},
    {'hlasov':117, 'počet': 12},
    {'hlasov':118, 'počet': 17},
    {'hlasov':119, 'počet': 23},
    {'hlasov':120, 'počet': 6},
    {'hlasov':121, 'počet': 8},
    {'hlasov':122, 'počet': 6},
    {'hlasov':123, 'počet': 9},
    {'hlasov':124, 'počet': 7},
    {'hlasov':125, 'počet': 9},
    {'hlasov':126, 'počet': 12},
    {'hlasov':127, 'počet': 12},
    {'hlasov':128, 'počet': 8},
    {'hlasov':129, 'počet': 9},
    {'hlasov':130, 'počet': 8},
    {'hlasov':131, 'počet': 8},
    {'hlasov':132, 'počet': 11},
    {'hlasov':133, 'počet': 11},
    {'hlasov':134, 'počet': 5},
    {'hlasov':135, 'počet': 7},
    {'hlasov':136, 'počet': 12},
    {'hlasov':137, 'počet': 13},
    {'hlasov':138, 'počet': 8},
    {'hlasov':139, 'počet': 6},
    {'hlasov':140, 'počet': 6},
    {'hlasov':141, 'počet': 4},
    {'hlasov':142, 'počet': 7},
    {'hlasov':143, 'počet': 5},
    {'hlasov':144, 'počet': 6},
    {'hlasov':145, 'počet': 1},
    {'hlasov':146, 'počet': 1},
    {'hlasov':147, 'počet': 0},
    {'hlasov':148, 'počet': 0},
    {'hlasov':149, 'počet': 0},
    {'hlasov':150, 'počet': 0}
]

const hourData = [
    {'hodina': 0, 'počet': 0},
    {'hodina': 1, 'počet': 0},
    {'hodina': 2, 'počet': 0},
    {'hodina': 3, 'počet': 0},
    {'hodina': 4, 'počet': 0},
    {'hodina': 5, 'počet': 0},
    {'hodina': 6, 'počet': 0},
    {'hodina': 7, 'počet': 0},
    {'hodina': 8, 'počet': 5},
    {'hodina': 9, 'počet': 23},
    {'hodina': 10, 'počet': 14},
    {'hodina': 11, 'počet': 737},
    {'hodina': 12, 'počet': 218},
    {'hodina': 13, 'počet': 91},
    {'hodina': 14, 'počet': 22},
    {'hodina': 15, 'počet': 102},
    {'hodina': 16, 'počet': 75},
    {'hodina': 17, 'počet': 566},
    {'hodina': 18, 'počet': 44},
    {'hodina': 19, 'počet': 16},
    {'hodina': 20, 'počet': 25},
    {'hodina': 21, 'počet': 8},
    {'hodina': 22, 'počet': 0},
    {'hodina': 23, 'počet': 0}
]

export default function Charts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                V akom mesiaci sa hlasovalo najviac?
            </dt>
        <BarChart
            className="mt-2"
            data={monthlyData}
            index="date"
            stack={true}
            categories={['schválené', 'neschválené']}
            colors={['blue', 'sky']}
            yAxisWidth={50}
        />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                Aký je najčastejší počet hlasov?
            </dt>
        <AreaChart
            className="mt-2"
            data={voteData}
            index="hlasov"
            categories={['počet']}
            colors={['blue']}
            yAxisWidth={50}
            showGradient={false}
        />
        </Card>
        <Card>
            <dt className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
                V aký čas sa hlasuje najčastejšie?
            </dt>
        <AreaChart
            className="mt-2"
            data={hourData}
            index="hodina"
            categories={['počet']}
            colors={['blue']}
            yAxisWidth={50}
            showGradient={false}
        />
        </Card>
    </div>
  );
}