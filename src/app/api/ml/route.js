import { NextResponse } from 'next/server';

const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    const interval = searchParams.get('interval') || '1mo';
    const region = searchParams.get('region') || 'US';
    const range = searchParams.get('range') || '5y';

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    const url = `https://${API_HOST}/stock/v3/get-chart?interval=${interval}&region=${region}&symbol=${symbol}&range=${range}&includeAdjustedClose=true`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data?.chart?.result?.length === 0) {
            return NextResponse.json({ error: 'No data found for the symbol' }, { status: 404 });
        }

        const timestamps = data.chart.result[0].timestamp;
        const adjCloses = data.chart.result[0].indicators.adjclose[0].adjclose;

        // Calculate the 9-day simple moving average (SMA9)
        const sma9 = calculateSMA9(timestamps, adjCloses);

        // Find buy/sell signals and untouched pivots
        const untouchedPivots = findUntouchedPivots(sma9);

        return NextResponse.json({ sma9, untouchedPivots });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Error fetching stock data' }, { status: 500 });
    }
}

// Function to calculate the 9-day moving average
function calculateSMA9(timestamps, adjCloses) {
    const sma9 = [];

    for (let i = 8; i < adjCloses.length; i++) {
        const sum = adjCloses.slice(i - 8, i + 1).reduce((acc, val) => acc + val, 0);
        const avg = sum / 9;
        sma9.push({
            timestamp: timestamps[i],
            sma9: avg,
        });
    }

    return sma9;
}

// Function to find untouched pivots
function findUntouchedPivots(sma9) {
    const untouchedPivots = [];
    const length = sma9.length;

    for (let i = 4; i < length; i++) {
        const [sma9_5, sma9_4, sma9_3, sma9_2, sma9_1] = [sma9[i - 4], sma9[i - 3], sma9[i - 2], sma9[i - 1], sma9[i]];

        // Buy signal criteria
        if (
            sma9_1.sma9 > sma9_2.sma9 &&
            sma9_2.sma9 > sma9_3.sma9 &&
            sma9_4.sma9 > sma9_3.sma9 &&
            sma9_4.sma9 > sma9_2.sma9 &&
            sma9_5.sma9 > sma9_4.sma9
        ) {
            // Check if it remains untouched (price does not cross sma9_3)
            const untouched = checkUntouchedPivot(sma9, i, sma9_3.sma9);
            if (untouched) {
                untouchedPivots.push({ type: 'buy', timestamp: sma9_3.timestamp });
            }
        }

        // Sell signal criteria
        if (
            sma9_1.sma9 < sma9_2.sma9 &&
            sma9_2.sma9 < sma9_3.sma9 &&
            sma9_4.sma9 < sma9_3.sma9 &&
            sma9_4.sma9 < sma9_2.sma9 &&
            sma9_5.sma9 < sma9_4.sma9
        ) {
            // Check if it remains untouched (price does not cross sma9_3)
            const untouched = checkUntouchedPivot(sma9, i, sma9_3.sma9);
            if (untouched) {
                untouchedPivots.push({ type: 'sell', timestamp: sma9_3.timestamp });
            }
        }
    }

    return untouchedPivots;
}

// Function to check if pivot remains untouched
function checkUntouchedPivot(sma9, index, pivot) {
    for (let i = index + 1; i < sma9.length; i++) {
        if (sma9[i].sma9 > pivot || sma9[i].sma9 < pivot) {
            return false;
        }
    }
    return true;
}
